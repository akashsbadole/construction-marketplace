import { supabase } from '@/lib/supabase/client'

export type DocumentType = 'aadhaar' | 'pan' | 'gst' | 'rera' | 'trade_license' | 'bank_statement' | 'address_proof'
export type KYCStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'expired'

export interface KYCDocument {
  id: string
  user_id: string
  document_type: DocumentType
  document_number?: string
  document_url: string
  verification_status: KYCStatus
  verified_at?: string
  verified_by?: string
  rejection_reason?: string
  expiry_date?: string
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface UploadDocumentRequest {
  document_type: DocumentType
  document_number?: string
  file: File
  metadata?: Record<string, any>
}

export interface VerificationResult {
  isValid: boolean
  extractedData?: Record<string, any>
  confidence?: number
  errors?: string[]
}

class KYCService {
  // Upload document to storage
  async uploadDocument(file: File, userId: string, documentType: DocumentType): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/${documentType}/${Date.now()}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('kyc-documents')
        .upload(fileName, file)

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('kyc-documents')
        .getPublicUrl(fileName)

      return publicUrl
    } catch (error) {
      console.error('Error uploading document:', error)
      throw new Error('Failed to upload document')
    }
  }

  // Submit KYC document
  async submitDocument(userId: string, request: UploadDocumentRequest): Promise<KYCDocument> {
    try {
      // Upload file to storage
      const documentUrl = await this.uploadDocument(request.file, userId, request.document_type)

      // Save document record
      const { data, error } = await supabase
        .from('kyc_documents')
        .insert({
          user_id: userId,
          document_type: request.document_type,
          document_number: request.document_number,
          document_url: documentUrl,
          verification_status: 'pending',
          metadata: request.metadata || {}
        })
        .select()
        .single()

      if (error) throw error

      // Trigger verification process
      await this.triggerVerification(data.id)

      return data
    } catch (error) {
      console.error('Error submitting document:', error)
      throw new Error('Failed to submit document')
    }
  }

  // Get user's KYC documents
  async getUserDocuments(userId: string): Promise<KYCDocument[]> {
    try {
      const { data, error } = await supabase
        .from('kyc_documents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching user documents:', error)
      return []
    }
  }

  // Get document by ID
  async getDocument(documentId: string): Promise<KYCDocument | null> {
    try {
      const { data, error } = await supabase
        .from('kyc_documents')
        .select('*')
        .eq('id', documentId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching document:', error)
      return null
    }
  }

  // Verify Aadhaar number format
  private verifyAadhaarFormat(aadhaarNumber: string): boolean {
    const aadhaarRegex = /^\d{4}\s?\d{4}\s?\d{4}$/
    return aadhaarRegex.test(aadhaarNumber.replace(/\s/g, ''))
  }

  // Verify PAN number format
  private verifyPANFormat(panNumber: string): boolean {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
    return panRegex.test(panNumber.toUpperCase())
  }

  // Verify GST number format
  private verifyGSTFormat(gstNumber: string): boolean {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
    return gstRegex.test(gstNumber.toUpperCase())
  }

  // Verify RERA number format (varies by state)
  private verifyRERAFormat(reraNumber: string): boolean {
    // Basic RERA format validation - can be enhanced per state
    const reraRegex = /^[A-Z]{2}RERA[A-Z0-9]{8,}$/
    return reraRegex.test(reraNumber.toUpperCase())
  }

  // Perform document verification
  async verifyDocument(documentId: string): Promise<VerificationResult> {
    try {
      const document = await this.getDocument(documentId)
      if (!document) {
        throw new Error('Document not found')
      }

      let result: VerificationResult = { isValid: false }

      switch (document.document_type) {
        case 'aadhaar':
          if (document.document_number) {
            result.isValid = this.verifyAadhaarFormat(document.document_number)
            if (!result.isValid) {
              result.errors = ['Invalid Aadhaar number format']
            }
          }
          break

        case 'pan':
          if (document.document_number) {
            result.isValid = this.verifyPANFormat(document.document_number)
            if (!result.isValid) {
              result.errors = ['Invalid PAN number format']
            }
          }
          break

        case 'gst':
          if (document.document_number) {
            result.isValid = this.verifyGSTFormat(document.document_number)
            if (!result.isValid) {
              result.errors = ['Invalid GST number format']
            }
          }
          break

        case 'rera':
          if (document.document_number) {
            result.isValid = this.verifyRERAFormat(document.document_number)
            if (!result.isValid) {
              result.errors = ['Invalid RERA number format']
            }
          }
          break

        default:
          result.isValid = true // For other document types, assume valid for now
      }

      // Update document status based on verification
      await this.updateDocumentStatus(
        documentId,
        result.isValid ? 'approved' : 'rejected',
        result.errors?.join(', ')
      )

      return result
    } catch (error) {
      console.error('Error verifying document:', error)
      return { isValid: false, errors: ['Verification failed'] }
    }
  }

  // Update document verification status
  async updateDocumentStatus(
    documentId: string,
    status: KYCStatus,
    rejectionReason?: string,
    verifiedBy?: string
  ): Promise<boolean> {
    try {
      const updateData: any = {
        verification_status: status,
        verified_at: status === 'approved' ? new Date().toISOString() : null,
        verified_by: verifiedBy,
        rejection_reason: rejectionReason
      }

      const { error } = await supabase
        .from('kyc_documents')
        .update(updateData)
        .eq('id', documentId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating document status:', error)
      return false
    }
  }

  // Trigger verification process (can be enhanced with external APIs)
  private async triggerVerification(documentId: string): Promise<void> {
    try {
      // Update status to under_review
      await this.updateDocumentStatus(documentId, 'under_review')

      // In a real implementation, you would:
      // 1. Call external verification APIs (like Aadhaar verification API)
      // 2. Use OCR to extract text from documents
      // 3. Perform additional validation checks
      
      // For now, we'll simulate verification after a delay
      setTimeout(async () => {
        await this.verifyDocument(documentId)
      }, 5000) // 5 second delay to simulate processing
    } catch (error) {
      console.error('Error triggering verification:', error)
    }
  }

  // Get KYC status for user
  async getUserKYCStatus(userId: string): Promise<{
    overall_status: 'incomplete' | 'pending' | 'approved' | 'rejected'
    documents: Record<DocumentType, KYCStatus | null>
    completion_percentage: number
  }> {
    try {
      const documents = await this.getUserDocuments(userId)
      
      const documentStatus: Record<DocumentType, KYCStatus | null> = {
        aadhaar: null,
        pan: null,
        gst: null,
        rera: null,
        trade_license: null,
        bank_statement: null,
        address_proof: null
      }

      // Map documents to their status
      documents.forEach(doc => {
        documentStatus[doc.document_type] = doc.verification_status
      })

      // Calculate completion percentage
      const totalDocuments = Object.keys(documentStatus).length
      const submittedDocuments = documents.length
      const approvedDocuments = documents.filter(doc => doc.verification_status === 'approved').length
      
      const completionPercentage = Math.round((approvedDocuments / totalDocuments) * 100)

      // Determine overall status
      let overallStatus: 'incomplete' | 'pending' | 'approved' | 'rejected' = 'incomplete'
      
      if (documents.some(doc => doc.verification_status === 'rejected')) {
        overallStatus = 'rejected'
      } else if (documents.some(doc => doc.verification_status === 'pending' || doc.verification_status === 'under_review')) {
        overallStatus = 'pending'
      } else if (approvedDocuments >= 3) { // Minimum 3 documents required
        overallStatus = 'approved'
      }

      return {
        overall_status: overallStatus,
        documents: documentStatus,
        completion_percentage: completionPercentage
      }
    } catch (error) {
      console.error('Error getting KYC status:', error)
      return {
        overall_status: 'incomplete',
        documents: {
          aadhaar: null,
          pan: null,
          gst: null,
          rera: null,
          trade_license: null,
          bank_statement: null,
          address_proof: null
        },
        completion_percentage: 0
      }
    }
  }

  // Delete document
  async deleteDocument(documentId: string): Promise<boolean> {
    try {
      const document = await this.getDocument(documentId)
      if (!document) return false

      // Delete from storage
      const fileName = document.document_url.split('/').pop()
      if (fileName) {
        await supabase.storage
          .from('kyc-documents')
          .remove([fileName])
      }

      // Delete from database
      const { error } = await supabase
        .from('kyc_documents')
        .delete()
        .eq('id', documentId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting document:', error)
      return false
    }
  }
}

export const kycService = new KYCService()
