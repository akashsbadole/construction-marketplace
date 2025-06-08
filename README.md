# BuildConnect - Location-Based Construction Marketplace

A comprehensive location-based marketplace platform for construction materials and services, built with Next.js, TypeScript, and modern web technologies.

![BuildConnect - Location-Based Construction Marketplace](screenshot.png "a title")

## 📚 Table of Contents

## 🏗️ Features

### Core Marketplace Features

- **Multi-role System**: Customer, Vendor, Contractor, and Admin roles
- **Location-based Services**: GPS-enabled vendor discovery and service radius management
- **Material Requirements**: Multi-step requirement posting with automatic vendor notifications
- **Product Catalog**: Comprehensive product management with categories, variants, and inventory
- **Shopping Cart**: Persistent cart with session management
- **Order Management**: Complete order lifecycle from placement to delivery
- **Search & Filtering**: Advanced search with location, price, and category filters

### Location-Based Features

- **Vendor Discovery**: Find vendors within specified radius
- **Service Area Management**: Vendors can define their service locations and delivery radius
- **Distance Calculation**: Accurate distance calculation using Haversine formula
- **Delivery Charges**: Dynamic delivery pricing based on distance
- **Location Verification**: Address geocoding and reverse geocoding

### Communication & Notifications

- **Multi-channel Notifications**: Email, SMS, and WhatsApp integration
- **Requirement Broadcasting**: Automatic notification to nearby vendors
- **Response Management**: Vendor response tracking and customer notifications
- **Communication Preferences**: User-defined contact preferences
- **Business Hours**: Vendor availability and response time tracking

### Advanced Features

- **Multi-step Forms**: Intuitive requirement posting with progress tracking
- **File Uploads**: Support for drawings, specifications, and reference images
- **Quote Management**: Vendor quotation system with comparison tools
- **Rating & Reviews**: Comprehensive review system for products and services
- **Analytics**: Business intelligence and performance tracking
- **Mobile Responsive**: Optimized for all device sizes

## 🚀 Technology Stack

### Frontend

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern UI component library
- **Lucide React**: Icon library

### Backend Services

- **Mock Database**: In-memory data storage (easily replaceable)
- **Location Service**: GPS and mapping functionality
- **Communication Service**: Multi-channel messaging
- **Authentication**: JWT-based auth system

### Integrations

- **Email Service**: SendGrid/AWS SES compatible
- **SMS Service**: Twilio integration
- **WhatsApp Business API**: WhatsApp messaging
- **Maps API**: Google Maps/Mapbox ready
- **Payment Gateways**: Razorpay, Stripe, PayPal support

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Quick Start

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-username/buildconnect.git
   cd buildconnect
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install

   # or

   yarn install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

4. **Configure environment variables**
   \`\`\`env

   # App Configuration

   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_APP_NAME=BuildConnect

   # Email Service (SendGrid/AWS SES)

   EMAIL_API_KEY=your_email_api_key
   FROM_EMAIL=noreply@buildconnect.com
   FROM_NAME=BuildConnect

   # Twilio SMS

   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_FROM_NUMBER=+1234567890

   # WhatsApp Business API

   WHATSAPP_API_KEY=your_whatsapp_api_key
   WHATSAPP_FROM_NUMBER=+1234567890
   WHATSAPP_API_URL=https://api.whatsapp.com

   # Maps & Location (Google Maps/Mapbox)

   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token

   # Payment Gateways

   NEXT_PUBLIC_RAZORPAY_KEY=your_razorpay_key
   RAZORPAY_SECRET=your_razorpay_secret
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key

   # Database (when replacing mock database)

   DATABASE_URL=postgresql://username:password@localhost:5432/buildconnect
   REDIS_URL=redis://localhost:6379

   # File Storage

   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_S3_BUCKET=your_s3_bucket
   AWS_REGION=us-east-1

   # Authentication

   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   \`\`\`

5. **Run the development server**
   \`\`\`bash
   npm run dev

   # or

   yarn dev
   \`\`\`

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

\`\`\`
buildconnect/
├── app/ # Next.js App Router
│ ├── (auth)/ # Authentication pages
│ ├── browse/ # Product browsing
│ ├── checkout/ # Checkout process
│ ├── contractors/ # Contractor listings
│ ├── materials/ # Material catalog
│ ├── orders/ # Order management
│ ├── post-requirement/ # Requirement posting
│ ├── profile/ # User profiles
│ ├── vendor-dashboard/ # Vendor management
│ └── layout.tsx # Root layout
├── components/ # Reusable components
│ ├── ui/ # shadcn/ui components
│ ├── navigation.tsx # Main navigation
│ ├── footer.tsx # Site footer
│ └── ... # Feature components
├── contexts/ # React contexts
│ ├── auth-context.tsx # Authentication state
│ └── cart-context.tsx # Shopping cart state
├── lib/ # Utilities and services
│ ├── services/ # Business logic
│ │ ├── marketplace-service.ts
│ │ ├── location-service.ts
│ │ └── communication-service.ts
│ ├── types/ # TypeScript definitions
│ │ └── marketplace.ts
│ └── utils.ts # Helper functions
├── public/ # Static assets
└── styles/ # Global styles
\`\`\`

## 🔧 Configuration

### Email Service Setup

#### SendGrid

\`\`\`env
EMAIL_API_KEY=SG.your_sendgrid_api_key
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=Your App Name
\`\`\`

#### AWS SES

\`\`\`env
EMAIL_API_KEY=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
FROM_EMAIL=noreply@yourdomain.com
\`\`\`

### SMS Service Setup (Twilio)

1. **Create Twilio Account**

   - Sign up at [twilio.com](https://twilio.com)
   - Get Account SID and Auth Token
   - Purchase a phone number

2. **Configure Environment**
   \`\`\`env
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_FROM_NUMBER=+1234567890
   \`\`\`

### WhatsApp Business API

1. **WhatsApp Business Account**

   - Apply for WhatsApp Business API
   - Get API credentials
   - Set up webhook endpoints

2. **Configure Environment**
   \`\`\`env
   WHATSAPP_API_KEY=your_api_key
   WHATSAPP_FROM_NUMBER=+1234567890
   WHATSAPP_API_URL=https://api.whatsapp.com
   \`\`\`

### Maps Integration

#### Google Maps

\`\`\`env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
\`\`\`

#### Mapbox

\`\`\`env
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token
\`\`\`

### Payment Gateway Setup

#### Razorpay

\`\`\`env
NEXT_PUBLIC_RAZORPAY_KEY=rzp_test_xxxxxxxxxx
RAZORPAY_SECRET=your_razorpay_secret
\`\`\`

#### Stripe

\`\`\`env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxx
\`\`\`

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   \`\`\`bash
   npm install -g vercel
   vercel
   \`\`\`

2. **Set Environment Variables**

   - Go to Vercel Dashboard
   - Add all environment variables
   - Deploy

3. **Custom Domain**
   - Add your domain in Vercel settings
   - Update DNS records

### Docker Deployment

1. **Build Docker Image**
   \`\`\`bash
   docker build -t buildconnect .
   \`\`\`

2. **Run Container**
   \`\`\`bash
   docker run -p 3000:3000 --env-file .env buildconnect
   \`\`\`

### Traditional Hosting

1. **Build Application**
   \`\`\`bash
   npm run build
   npm run start
   \`\`\`

2. **Process Manager**
   \`\`\`bash
   npm install -g pm2
   pm2 start npm --name "buildconnect" -- start
   \`\`\`

## 🗄️ Database Setup

### PostgreSQL (Production)

1. **Install PostgreSQL**
   \`\`\`bash

   # Ubuntu/Debian

   sudo apt-get install postgresql postgresql-contrib

   # macOS

   brew install postgresql
   \`\`\`

2. **Create Database**
   \`\`\`sql
   CREATE DATABASE buildconnect;
   CREATE USER buildconnect_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE buildconnect TO buildconnect_user;
   \`\`\`

3. **Update Environment**
   \`\`\`env
   DATABASE_URL=postgresql://buildconnect_user:your_password@localhost:5432/buildconnect
   \`\`\`

### Redis (Caching)

1. **Install Redis**
   \`\`\`bash

   # Ubuntu/Debian

   sudo apt-get install redis-server

   # macOS

   brew install redis
   \`\`\`

2. **Configure Environment**
   \`\`\`env
   REDIS_URL=redis://localhost:6379
   \`\`\`

## 📱 API Documentation

### Authentication Endpoints

\`\`\`typescript
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET /api/auth/me
\`\`\`

### Requirements API

\`\`\`typescript
POST /api/requirements # Create requirement
GET /api/requirements # List requirements
GET /api/requirements/[id] # Get requirement
PUT /api/requirements/[id] # Update requirement
DELETE /api/requirements/[id] # Delete requirement
\`\`\`

### Vendor Response API

\`\`\`typescript
POST /api/requirements/[id]/responses # Submit response
GET /api/requirements/[id]/responses # List responses
PUT /api/responses/[id] # Update response
\`\`\`

### Location API

\`\`\`typescript
POST /api/location/geocode # Address to coordinates
POST /api/location/reverse-geocode # Coordinates to address
GET /api/location/nearby-vendors # Find nearby vendors
\`\`\`

### Notification API

\`\`\`typescript
POST /api/notifications/send # Send notification
GET /api/notifications # List notifications
PUT /api/notifications/[id]/read # Mark as read
\`\`\`

## 🧪 Testing

### Unit Tests

\`\`\`bash
npm run test
\`\`\`

### Integration Tests

\`\`\`bash
npm run test:integration
\`\`\`

### E2E Tests

\`\`\`bash
npm run test:e2e
\`\`\`

## 🔒 Security

### Authentication

- JWT-based authentication
- Secure password hashing
- Session management
- Role-based access control

### Data Protection

- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection

### API Security

- Rate limiting
- API key authentication
- Request validation
- Error handling

## 📊 Monitoring

### Application Monitoring

- Error tracking with Sentry
- Performance monitoring
- User analytics
- Business metrics

### Infrastructure Monitoring

- Server health checks
- Database performance
- API response times
- Uptime monitoring

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**
   \`\`\`bash
   git checkout -b feature/amazing-feature
   \`\`\`
3. **Commit changes**
   \`\`\`bash
   git commit -m 'Add amazing feature'
   \`\`\`
4. **Push to branch**
   \`\`\`bash
   git push origin feature/amazing-feature
   \`\`\`
5. **Open Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation

- [API Documentation](docs/api.md)
- [Deployment Guide](docs/deployment.md)
- [Contributing Guide](docs/contributing.md)

### Community

- [Discord Server](https://discord.gg/buildconnect)
- [GitHub Discussions](https://github.com/your-username/buildconnect/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/buildconnect)

### Commercial Support

- Email: support@buildconnect.com
- Phone: +1-800-BUILD-CONNECT
- Enterprise: enterprise@buildconnect.com

## 🗺️ Roadmap

### Phase 1 (Current)

- ✅ Basic marketplace functionality
- ✅ Location-based vendor discovery
- ✅ Multi-step requirement forms
- ✅ Communication integrations

### Phase 2 (Next 3 months)

- 🔄 Real-time chat system
- 🔄 Advanced analytics dashboard
- 🔄 Mobile app (React Native)
- 🔄 AI-powered vendor matching

### Phase 3 (Next 6 months)

- 📋 IoT integration for inventory
- 📋 Blockchain for supply chain
- 📋 AR/VR for product visualization
- 📋 Machine learning recommendations

### Phase 4 (Next 12 months)

- 📋 International expansion
- 📋 Multi-language support
- 📋 Advanced logistics integration
- 📋 Enterprise solutions

## 📈 Performance

### Optimization

- Image optimization with Next.js
- Code splitting and lazy loading
- CDN integration
- Database query optimization

### Scalability

- Horizontal scaling support
- Load balancing
- Caching strategies
- Microservices architecture

## 🌍 Internationalization

### Supported Languages

- English (default)
- Hindi
- Regional Indian languages

### Currency Support

- Indian Rupee (INR)
- US Dollar (USD)
- Euro (EUR)

## 📞 Contact

**BuildConnect Team**

- Website: [buildconnect.com](https://buildconnect.com)
- Email: hello@buildconnect.com
- Twitter: [@BuildConnectApp](https://twitter.com/BuildConnectApp)
- LinkedIn: [BuildConnect](https://linkedin.com/company/buildconnect)

---

Made with ❤️ by the BuildConnect Team
