'use client'

import { useState, useRef } from 'react'
import { kycService, DocumentType, KYCDocument } from '@/lib/services/kyc-service'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  UploadIcon,
  FileTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  TrashIcon,
  AlertCircleIcon
} from 'lucide-react'

const documentTypes: { type: DocumentType; label: string; description: string; required: boolean }[] = [
  { type: 'aadhaar', label: 'Aadhaar Card', description: 'Government issued identity proof', required: true },
  { type: 'pan', label: 'PAN Card', description: 'Permanent Account Number card', required: true },
  { type: 'gst', label: 'GST Certificate', description: 'For vendors and contractors', required: false },
  { type: 'rera', label: 'RERA Certificate', description: 'For real estate contractors', required: false },
  { type: 'trade_license', label: 'Trade License', description: 'Business registration document', required: false },
  { type: 'bank_statement', label: 'Bank Statement', description: 'Last 3 months bank statement', required: false },
  { type: 'address_proof', label: 'Address Proof', description: 'Utility bill or rental agreement', required: true }
]

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon, label: 'Pending' },
  under_review: { color: 'bg-blue-100 text-blue-800', icon: ClockIcon, label: 'Under Review' },
  approved: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon, label: 'Approved' },
  rejected: { color: 'bg-red-100 text-red-800', icon: XCircleIcon, label: 'Rejected' },
  expired: { color: 'bg-gray-100 text-gray-800', icon: XCircleIcon, label: 'Expired' }
}

interface KYCUploadProps {
  userId: string
  userRole: 'customer' | 'contractor' | 'vendor'
  onStatusChange?: (status: any) => void
}

export function KYCUpload({ userId, userRole, onStatusChange }: KYCUploadProps) {
  const [documents, setDocuments] = useState<KYCDocument[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingType, setUploadingType] = useState<DocumentType | null>(null)
  const [kycStatus, setKycStatus] = useState<any>(null)
  const fileInputRefs = useRef<Record<DocumentType, HTMLInputElement | null>>({} as any)

  // Load user documents and status
  const loadDocuments = async () => {
    try {
      const [userDocs, status] = await Promise.all([
        kycService.getUserDocuments(userId),
        kycService.getUserKYCStatus(userId)
      ])
      
      setDocuments(userDocs)
      setKycStatus(status)
      onStatusChange?.(status)
    } catch (error) {
      console.error('Error loading documents:', error)
    }
  }

  // Handle file upload
  const handleFileUpload = async (documentType: DocumentType, file: File, documentNumber?: string) => {
    setUploadingType(documentType)
    try {
      await kycService.submitDocument(userId, {
        document_type: documentType,
        file,
        document_number: documentNumber,
        metadata: { userRole }
      })
      
      await loadDocuments()
    } catch (error) {
      console.error('Error uploading document:', error)
      alert('Failed to upload document. Please try again.')
    } finally {
      setUploadingType(null)
    }
  }

  // Handle file input change
  const handleFileChange = (documentType: DocumentType) => {
    const input = fileInputRefs.current[documentType]
    const file = input?.files?.[0]
    
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload only JPG, PNG, or PDF files')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB')
        return
      }
      
      // For documents that require number, prompt for it
      let documentNumber = ''
      if (['aadhaar', 'pan', 'gst', 'rera'].includes(documentType)) {
        documentNumber = prompt(`Enter ${documentType.toUpperCase()} number:`) || ''
        if (!documentNumber) {
          alert('Document number is required')
          return
        }
      }
      
      handleFileUpload(documentType, file, documentNumber)
    }
  }

  // Delete document
  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return
    
    try {
      await kycService.deleteDocument(documentId)
      await loadDocuments()
    } catch (error) {
      console.error('Error deleting document:', error)
      alert('Failed to delete document')
    }
  }

  // Get document for type
  const getDocumentForType = (type: DocumentType) => {
    return documents.find(doc => doc.document_type === type)
  }

  // Filter document types based on user role
  const getRelevantDocumentTypes = () => {
    const baseTypes = ['aadhaar', 'pan', 'address_proof']
    
    if (userRole === 'vendor' || userRole === 'contractor') {
      baseTypes.push('gst', 'trade_license', 'bank_statement')
    }
    
    if (userRole === 'contractor') {
      baseTypes.push('rera')
    }
    
    return documentTypes.filter(doc => baseTypes.includes(doc.type))
  }

  return (
    <div className="space-y-6">
      {/* KYC Status Overview */}
      {kycStatus && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              KYC Verification Status
              <Badge className={
                kycStatus.overall_status === 'approved' ? 'bg-green-100 text-green-800' :
                kycStatus.overall_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                kycStatus.overall_status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }>
                {kycStatus.overall_status.charAt(0).toUpperCase() + kycStatus.overall_status.slice(1)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Completion Progress</span>
                  <span>{kycStatus.completion_percentage}%</span>
                </div>
                <Progress value={kycStatus.completion_percentage} className="h-2" />
              </div>
              
              {kycStatus.overall_status === 'rejected' && (
                <Alert>
                  <AlertCircleIcon className="h-4 w-4" />
                  <AlertDescription>
                    Some documents were rejected. Please review and re-upload the required documents.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document Upload Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {getRelevantDocumentTypes().map((docType) => {
          const document = getDocumentForType(docType.type)
          const isUploading = uploadingType === docType.type
          const statusInfo = document ? statusConfig[document.verification_status] : null
          const StatusIcon = statusInfo?.icon

          return (
            <Card key={docType.type} className="relative">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileTextIcon className="h-5 w-5" />
                    {docType.label}
                    {docType.required && <span className="text-red-500">*</span>}
                  </div>
                  {document && StatusIcon && (
                    <Badge className={statusInfo.color}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusInfo.label}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{docType.description}</p>
                
                {document ? (
                  <div className="space-y-3">
                    {document.document_number && (
                      <div className="text-sm">
                        <span className="font-medium">Document Number: </span>
                        <span className="font-mono">{document.document_number}</span>
                      </div>
                    )}
                    
                    <div className="text-xs text-muted-foreground">
                      Uploaded on {new Date(document.created_at).toLocaleDateString()}
                    </div>
                    
                    {document.rejection_reason && (
                      <Alert>
                        <AlertCircleIcon className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          {document.rejection_reason}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(document.document_url, '_blank')}
                      >
                        <EyeIcon className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteDocument(document.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                      
                      {document.verification_status === 'rejected' && (
                        <Button
                          size="sm"
                          onClick={() => fileInputRefs.current[docType.type]?.click()}
                          disabled={isUploading}
                        >
                          <UploadIcon className="h-4 w-4 mr-2" />
                          Re-upload
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button
                      onClick={() => fileInputRefs.current[docType.type]?.click()}
                      disabled={isUploading}
                      className="w-full"
                    >
                      {isUploading ? (
                        <>
                          <ClockIcon className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <UploadIcon className="h-4 w-4 mr-2" />
                          Upload {docType.label}
                        </>
                      )}
                    </Button>
                    
                    <p className="text-xs text-muted-foreground text-center">
                      Supported formats: JPG, PNG, PDF (Max 5MB)
                    </p>
                  </div>
                )}
                
                <input
                  ref={(el) => fileInputRefs.current[docType.type] = el}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,application/pdf"
                  onChange={() => handleFileChange(docType.type)}
                  className="hidden"
                />
              </CardContent>
            </Card>
          )
        })}
      </div>
      
      {/* Help Text */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3">Important Guidelines:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Ensure all documents are clear and readable</li>
            <li>• Upload original documents only (no photocopies)</li>
            <li>• Document numbers should match exactly with uploaded files</li>
            <li>• Verification typically takes 24-48 hours</li>
            <li>• You'll receive notifications about verification status</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
