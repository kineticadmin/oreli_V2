
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime
} = require('./runtime/edge.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.NotFoundError = NotFoundError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}





/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  phone: 'phone',
  passwordHash: 'passwordHash',
  firstName: 'firstName',
  lastName: 'lastName',
  locale: 'locale',
  status: 'status',
  marketingConsent: 'marketingConsent',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  lastLoginAt: 'lastLoginAt'
};

exports.Prisma.UserAddressScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  label: 'label',
  name: 'name',
  line: 'line',
  city: 'city',
  postalCode: 'postalCode',
  country: 'country',
  isDefault: 'isDefault',
  createdAt: 'createdAt'
};

exports.Prisma.UserOauthAccountScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  provider: 'provider',
  providerId: 'providerId',
  createdAt: 'createdAt'
};

exports.Prisma.RefreshTokenScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  tokenHash: 'tokenHash',
  familyId: 'familyId',
  expiresAt: 'expiresAt',
  usedAt: 'usedAt',
  createdAt: 'createdAt'
};

exports.Prisma.RelationshipScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  displayName: 'displayName',
  relationshipType: 'relationshipType',
  birthdate: 'birthdate',
  preferences: 'preferences',
  affinityScore: 'affinityScore',
  createdAt: 'createdAt'
};

exports.Prisma.GiftingEventScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  relationshipId: 'relationshipId',
  eventType: 'eventType',
  eventDate: 'eventDate',
  isRecurring: 'isRecurring',
  notes: 'notes',
  createdAt: 'createdAt'
};

exports.Prisma.EventReminderScalarFieldEnum = {
  id: 'id',
  eventId: 'eventId',
  sentAt: 'sentAt',
  channel: 'channel',
  createdAt: 'createdAt'
};

exports.Prisma.SellerScalarFieldEnum = {
  id: 'id',
  displayName: 'displayName',
  legalName: 'legalName',
  vatNumber: 'vatNumber',
  status: 'status',
  kybStatus: 'kybStatus',
  stripeAccountId: 'stripeAccountId',
  reliabilityScore: 'reliabilityScore',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SellerUserScalarFieldEnum = {
  sellerId: 'sellerId',
  userId: 'userId',
  role: 'role'
};

exports.Prisma.SellerPolicyScalarFieldEnum = {
  sellerId: 'sellerId',
  slaPrepHours: 'slaPrepHours',
  slaDeliveryHours: 'slaDeliveryHours',
  deliveryZoneGeoJson: 'deliveryZoneGeoJson',
  cutoffTimeLocal: 'cutoffTimeLocal',
  updatedAt: 'updatedAt'
};

exports.Prisma.CategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug'
};

exports.Prisma.ProductScalarFieldEnum = {
  id: 'id',
  sellerId: 'sellerId',
  categoryId: 'categoryId',
  status: 'status',
  title: 'title',
  description: 'description',
  priceAmount: 'priceAmount',
  currency: 'currency',
  isSurpriseReady: 'isSurpriseReady',
  isLastMinuteOk: 'isLastMinuteOk',
  preparationTimeMin: 'preparationTimeMin',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProductAssetScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  url: 'url',
  position: 'position',
  createdAt: 'createdAt'
};

exports.Prisma.TagScalarFieldEnum = {
  id: 'id',
  slug: 'slug',
  label: 'label'
};

exports.Prisma.ProductTagScalarFieldEnum = {
  productId: 'productId',
  tagId: 'tagId'
};

exports.Prisma.InventoryScalarFieldEnum = {
  productId: 'productId',
  stockQuantity: 'stockQuantity',
  reservedQuantity: 'reservedQuantity',
  updatedAt: 'updatedAt'
};

exports.Prisma.OrderScalarFieldEnum = {
  id: 'id',
  buyerUserId: 'buyerUserId',
  status: 'status',
  currency: 'currency',
  itemsSubtotalAmount: 'itemsSubtotalAmount',
  serviceFeeAmount: 'serviceFeeAmount',
  deliveryFeeAmount: 'deliveryFeeAmount',
  totalAmount: 'totalAmount',
  giftMessage: 'giftMessage',
  surpriseMode: 'surpriseMode',
  requestedDeliveryDate: 'requestedDeliveryDate',
  deliveryAddressSnapshot: 'deliveryAddressSnapshot',
  stripePaymentIntentId: 'stripePaymentIntentId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.OrderItemScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  productId: 'productId',
  productSnapshot: 'productSnapshot',
  quantity: 'quantity',
  unitPriceAmount: 'unitPriceAmount',
  createdAt: 'createdAt'
};

exports.Prisma.OrderStatusEventScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  fromStatus: 'fromStatus',
  toStatus: 'toStatus',
  actorType: 'actorType',
  actorId: 'actorId',
  note: 'note',
  createdAt: 'createdAt'
};

exports.Prisma.PaymentScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  stripePaymentIntentId: 'stripePaymentIntentId',
  status: 'status',
  amountCents: 'amountCents',
  currency: 'currency',
  paidAt: 'paidAt',
  createdAt: 'createdAt'
};

exports.Prisma.RefundScalarFieldEnum = {
  id: 'id',
  paymentId: 'paymentId',
  stripeRefundId: 'stripeRefundId',
  amountCents: 'amountCents',
  reason: 'reason',
  createdAt: 'createdAt'
};

exports.Prisma.FulfillmentScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  sellerId: 'sellerId',
  status: 'status',
  acceptDeadline: 'acceptDeadline',
  shippedAt: 'shippedAt',
  deliveredAt: 'deliveredAt',
  trackingCode: 'trackingCode',
  proofPhotoUrl: 'proofPhotoUrl',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SellerPayoutScalarFieldEnum = {
  id: 'id',
  sellerId: 'sellerId',
  stripePayoutId: 'stripePayoutId',
  amountCents: 'amountCents',
  currency: 'currency',
  status: 'status',
  periodStart: 'periodStart',
  periodEnd: 'periodEnd',
  processedAt: 'processedAt',
  createdAt: 'createdAt'
};

exports.Prisma.SupportTicketScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  userId: 'userId',
  status: 'status',
  subject: 'subject',
  priority: 'priority',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SupportMessageScalarFieldEnum = {
  id: 'id',
  ticketId: 'ticketId',
  authorId: 'authorId',
  authorRole: 'authorRole',
  content: 'content',
  createdAt: 'createdAt'
};

exports.Prisma.SystemConfigScalarFieldEnum = {
  key: 'key',
  value: 'value',
  updatedAt: 'updatedAt',
  updatedBy: 'updatedBy'
};

exports.Prisma.AdminActionScalarFieldEnum = {
  id: 'id',
  adminId: 'adminId',
  action: 'action',
  targetType: 'targetType',
  targetId: 'targetId',
  payload: 'payload',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.UserStatus = exports.$Enums.UserStatus = {
  active: 'active',
  suspended: 'suspended',
  deleted: 'deleted'
};

exports.OauthProvider = exports.$Enums.OauthProvider = {
  google: 'google',
  apple: 'apple'
};

exports.RelationshipType = exports.$Enums.RelationshipType = {
  partner: 'partner',
  friend: 'friend',
  parent: 'parent',
  child: 'child',
  colleague: 'colleague',
  other: 'other'
};

exports.ReminderChannel = exports.$Enums.ReminderChannel = {
  push: 'push',
  email: 'email',
  sms: 'sms'
};

exports.SellerStatus = exports.$Enums.SellerStatus = {
  pending: 'pending',
  active: 'active',
  suspended: 'suspended'
};

exports.KybStatus = exports.$Enums.KybStatus = {
  pending: 'pending',
  submitted: 'submitted',
  approved: 'approved',
  rejected: 'rejected'
};

exports.ProductStatus = exports.$Enums.ProductStatus = {
  draft: 'draft',
  pending_review: 'pending_review',
  active: 'active',
  paused: 'paused',
  archived: 'archived'
};

exports.OrderStatus = exports.$Enums.OrderStatus = {
  draft: 'draft',
  pending_payment: 'pending_payment',
  paid: 'paid',
  accepted: 'accepted',
  in_preparation: 'in_preparation',
  shipped: 'shipped',
  delivered: 'delivered',
  cancelled: 'cancelled',
  refunded: 'refunded'
};

exports.SurpriseMode = exports.$Enums.SurpriseMode = {
  total: 'total',
  controlled: 'controlled',
  manual: 'manual'
};

exports.PaymentStatus = exports.$Enums.PaymentStatus = {
  pending: 'pending',
  succeeded: 'succeeded',
  failed: 'failed',
  disputed: 'disputed',
  refunded: 'refunded'
};

exports.FulfillmentStatus = exports.$Enums.FulfillmentStatus = {
  pending: 'pending',
  accepted: 'accepted',
  rejected: 'rejected',
  in_preparation: 'in_preparation',
  shipped: 'shipped',
  delivered: 'delivered'
};

exports.PayoutStatus = exports.$Enums.PayoutStatus = {
  pending: 'pending',
  processing: 'processing',
  paid: 'paid',
  failed: 'failed'
};

exports.TicketStatus = exports.$Enums.TicketStatus = {
  open: 'open',
  in_progress: 'in_progress',
  resolved: 'resolved',
  closed: 'closed'
};

exports.TicketPriority = exports.$Enums.TicketPriority = {
  low: 'low',
  normal: 'normal',
  high: 'high',
  urgent: 'urgent'
};

exports.Prisma.ModelName = {
  User: 'User',
  UserAddress: 'UserAddress',
  UserOauthAccount: 'UserOauthAccount',
  RefreshToken: 'RefreshToken',
  Relationship: 'Relationship',
  GiftingEvent: 'GiftingEvent',
  EventReminder: 'EventReminder',
  Seller: 'Seller',
  SellerUser: 'SellerUser',
  SellerPolicy: 'SellerPolicy',
  Category: 'Category',
  Product: 'Product',
  ProductAsset: 'ProductAsset',
  Tag: 'Tag',
  ProductTag: 'ProductTag',
  Inventory: 'Inventory',
  Order: 'Order',
  OrderItem: 'OrderItem',
  OrderStatusEvent: 'OrderStatusEvent',
  Payment: 'Payment',
  Refund: 'Refund',
  Fulfillment: 'Fulfillment',
  SellerPayout: 'SellerPayout',
  SupportTicket: 'SupportTicket',
  SupportMessage: 'SupportMessage',
  SystemConfig: 'SystemConfig',
  AdminAction: 'AdminAction'
};
/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "/Users/brunellagoosou/Documents/Kinetic/projets/oreli-gift-magic/packages/prisma/generated/client",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "darwin-arm64",
        "native": true
      },
      {
        "fromEnvVar": null,
        "value": "rhel-openssl-3.0.x"
      }
    ],
    "previewFeatures": [
      "postgresqlExtensions"
    ],
    "sourceFilePath": "/Users/brunellagoosou/Documents/Kinetic/projets/oreli-gift-magic/packages/prisma/schema.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": null,
    "schemaEnvPath": "../../.env"
  },
  "relativePath": "../..",
  "clientVersion": "5.22.0",
  "engineVersion": "605197351a3c8bdd595af2d2a9bc3025bca48ea2",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "// Oreli — Schema Prisma V1\n// PostgreSQL 15 + pgvector\n// Extensions SQL requises (migrations manuelles) :\n//   CREATE EXTENSION IF NOT EXISTS vector;\n//   CREATE EXTENSION IF NOT EXISTS unaccent;\n//   CREATE EXTENSION IF NOT EXISTS postgis;\n\ngenerator client {\n  provider        = \"prisma-client-js\"\n  output          = \"./generated/client\"\n  previewFeatures = [\"postgresqlExtensions\"]\n  binaryTargets   = [\"native\", \"rhel-openssl-3.0.x\"]\n}\n\ndatasource db {\n  provider   = \"postgresql\"\n  url        = env(\"DATABASE_URL\")\n  extensions = [vector, unaccent]\n}\n\n// ─── Identité & Accès ──────────────────────────────────────────────────────\n\nmodel User {\n  id               String     @id @default(dbgenerated(\"gen_random_uuid()\")) @db.Uuid\n  email            String     @unique\n  phone            String?\n  passwordHash     String?    @map(\"password_hash\")\n  firstName        String     @map(\"first_name\")\n  lastName         String     @map(\"last_name\")\n  locale           String     @default(\"fr\")\n  status           UserStatus @default(active)\n  marketingConsent Boolean    @default(false) @map(\"marketing_consent\")\n  createdAt        DateTime   @default(now()) @map(\"created_at\") @db.Timestamptz\n  updatedAt        DateTime   @updatedAt @map(\"updated_at\") @db.Timestamptz\n  lastLoginAt      DateTime?  @map(\"last_login_at\") @db.Timestamptz\n\n  addresses     UserAddress[]\n  relationships Relationship[]\n  orders        Order[]\n  oauthAccounts UserOauthAccount[]\n  refreshTokens RefreshToken[]\n  adminActions  AdminAction[]\n\n  @@index([email])\n  @@index([status, createdAt(sort: Desc)])\n  @@map(\"users\")\n}\n\nenum UserStatus {\n  active\n  suspended\n  deleted\n}\n\nmodel UserAddress {\n  id         String   @id @default(dbgenerated(\"gen_random_uuid()\")) @db.Uuid\n  userId     String   @map(\"user_id\") @db.Uuid\n  label      String   @default(\"Domicile\")\n  name       String\n  line       String\n  city       String\n  postalCode String   @map(\"postal_code\")\n  country    String   @default(\"BE\")\n  isDefault  Boolean  @default(false) @map(\"is_default\")\n  createdAt  DateTime @default(now()) @map(\"created_at\") @db.Timestamptz\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@map(\"user_addresses\")\n}\n\nmodel UserOauthAccount {\n  id         String        @id @default(dbgenerated(\"gen_random_uuid()\")) @db.Uuid\n  userId     String        @map(\"user_id\") @db.Uuid\n  provider   OauthProvider\n  providerId String        @map(\"provider_id\")\n  createdAt  DateTime      @default(now()) @map(\"created_at\") @db.Timestamptz\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([provider, providerId])\n  @@index([userId])\n  @@map(\"user_oauth_accounts\")\n}\n\nenum OauthProvider {\n  google\n  apple\n}\n\nmodel RefreshToken {\n  id        String    @id @default(dbgenerated(\"gen_random_uuid()\")) @db.Uuid\n  userId    String    @map(\"user_id\") @db.Uuid\n  tokenHash String    @unique @map(\"token_hash\")\n  // familyId regroupe tous les tokens d'une même chaîne de rotation.\n  // Si un token déjà consommé est réutilisé → toute la famille est révoquée.\n  familyId  String    @map(\"family_id\") @db.Uuid\n  expiresAt DateTime  @map(\"expires_at\") @db.Timestamptz\n  usedAt    DateTime? @map(\"used_at\") @db.Timestamptz\n  createdAt DateTime  @default(now()) @map(\"created_at\") @db.Timestamptz\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@index([familyId])\n  @@map(\"refresh_tokens\")\n}\n\n// ─── Relationship Graph (avantage concurrentiel) ───────────────────────────\n\nmodel Relationship {\n  id               String           @id @default(dbgenerated(\"gen_random_uuid()\")) @db.Uuid\n  userId           String           @map(\"user_id\") @db.Uuid\n  displayName      String           @map(\"display_name\")\n  relationshipType RelationshipType @map(\"relationship_type\")\n  birthdate        DateTime?        @db.Date\n  // Préférences libres : goûts, allergies, tailles, couleurs, style…\n  preferences      Json             @default(\"{}\") @db.JsonB\n  affinityScore    Float            @default(0.5) @map(\"affinity_score\")\n  createdAt        DateTime         @default(now()) @map(\"created_at\") @db.Timestamptz\n\n  user   User           @relation(fields: [userId], references: [id], onDelete: Cascade)\n  events GiftingEvent[]\n\n  @@index([userId])\n  @@map(\"relationships\")\n}\n\nenum RelationshipType {\n  partner\n  friend\n  parent\n  child\n  colleague\n  other\n}\n\nmodel GiftingEvent {\n  id             String   @id @default(dbgenerated(\"gen_random_uuid()\")) @db.Uuid\n  userId         String   @map(\"user_id\") @db.Uuid\n  relationshipId String   @map(\"relationship_id\") @db.Uuid\n  eventType      String   @map(\"event_type\")\n  eventDate      DateTime @map(\"event_date\") @db.Date\n  isRecurring    Boolean  @default(true) @map(\"is_recurring\")\n  notes          String?\n  createdAt      DateTime @default(now()) @map(\"created_at\") @db.Timestamptz\n\n  relationship Relationship    @relation(fields: [relationshipId], references: [id], onDelete: Cascade)\n  reminders    EventReminder[]\n\n  @@index([userId, eventDate])\n  @@map(\"gifting_events\")\n}\n\nmodel EventReminder {\n  id        String          @id @default(dbgenerated(\"gen_random_uuid()\")) @db.Uuid\n  eventId   String          @map(\"event_id\") @db.Uuid\n  sentAt    DateTime?       @map(\"sent_at\") @db.Timestamptz\n  channel   ReminderChannel\n  createdAt DateTime        @default(now()) @map(\"created_at\") @db.Timestamptz\n\n  event GiftingEvent @relation(fields: [eventId], references: [id], onDelete: Cascade)\n\n  @@index([eventId])\n  @@map(\"event_reminders\")\n}\n\nenum ReminderChannel {\n  push\n  email\n  sms\n}\n\n// ─── Vendeurs ──────────────────────────────────────────────────────────────\n\nmodel Seller {\n  id               String       @id @default(dbgenerated(\"gen_random_uuid()\")) @db.Uuid\n  displayName      String       @map(\"display_name\")\n  legalName        String?      @map(\"legal_name\")\n  vatNumber        String?      @map(\"vat_number\")\n  status           SellerStatus @default(pending)\n  kybStatus        KybStatus    @default(pending) @map(\"kyb_status\")\n  stripeAccountId  String?      @map(\"stripe_account_id\")\n  // Score de fiabilité calculé sur les 30 derniers jours (0-1).\n  // Seuil minimum pour apparaître dans les recommendations : 0.70\n  reliabilityScore Float        @default(1.0) @map(\"reliability_score\")\n  createdAt        DateTime     @default(now()) @map(\"created_at\") @db.Timestamptz\n  updatedAt        DateTime     @updatedAt @map(\"updated_at\") @db.Timestamptz\n\n  users    SellerUser[]\n  products Product[]\n  policy   SellerPolicy?\n  payouts  SellerPayout[]\n\n  @@index([status])\n  @@map(\"sellers\")\n}\n\nenum SellerStatus {\n  pending\n  active\n  suspended\n}\n\nenum KybStatus {\n  pending\n  submitted\n  approved\n  rejected\n}\n\nmodel SellerUser {\n  sellerId String @map(\"seller_id\") @db.Uuid\n  userId   String @map(\"user_id\") @db.Uuid\n  role     String @default(\"owner\")\n\n  seller Seller @relation(fields: [sellerId], references: [id], onDelete: Cascade)\n\n  @@id([sellerId, userId])\n  @@map(\"seller_users\")\n}\n\nmodel SellerPolicy {\n  sellerId            String   @id @map(\"seller_id\") @db.Uuid\n  // Temps de préparation avant remise au transporteur (en heures)\n  slaPrepHours        Int      @default(4) @map(\"sla_prep_hours\")\n  // Temps de livraison estimé (en heures)\n  slaDeliveryHours    Int      @default(24) @map(\"sla_delivery_hours\")\n  // Zone de livraison GeoJSON (polygone couvrant les codes postaux servis)\n  deliveryZoneGeoJson Json?    @map(\"delivery_zone_geojson\") @db.JsonB\n  cutoffTimeLocal     String   @default(\"17:00\") @map(\"cutoff_time_local\")\n  updatedAt           DateTime @updatedAt @map(\"updated_at\") @db.Timestamptz\n\n  seller Seller @relation(fields: [sellerId], references: [id], onDelete: Cascade)\n\n  @@map(\"seller_policies\")\n}\n\n// ─── Catalogue ─────────────────────────────────────────────────────────────\n\nmodel Category {\n  id       String    @id @default(dbgenerated(\"gen_random_uuid()\")) @db.Uuid\n  name     String    @unique\n  slug     String    @unique\n  products Product[]\n\n  @@map(\"categories\")\n}\n\nmodel Product {\n  id                 String                      @id @default(dbgenerated(\"gen_random_uuid()\")) @db.Uuid\n  sellerId           String                      @map(\"seller_id\") @db.Uuid\n  categoryId         String?                     @map(\"category_id\") @db.Uuid\n  status             ProductStatus               @default(draft)\n  title              String\n  description        String\n  // Prix en centimes EUR (ex: 5000 = 50.00 EUR)\n  priceAmount        Int                         @map(\"price_amount\")\n  currency           String                      @default(\"EUR\")\n  isSurpriseReady    Boolean                     @default(false) @map(\"is_surprise_ready\")\n  isLastMinuteOk     Boolean                     @default(false) @map(\"is_last_minute_ok\")\n  // Temps de préparation spécifique au produit (en minutes). Null = utilise le SLA vendeur.\n  preparationTimeMin Int?                        @map(\"preparation_time_min\")\n  // Vecteur d'embedding généré par Vertex AI text-embedding-004 (768 dimensions).\n  // Généré de façon asynchrone via BullMQ job \"product-embedding\".\n  embedding          Unsupported(\"vector(768)\")?\n  createdAt          DateTime                    @default(now()) @map(\"created_at\") @db.Timestamptz\n  updatedAt          DateTime                    @updatedAt @map(\"updated_at\") @db.Timestamptz\n\n  seller     Seller         @relation(fields: [sellerId], references: [id])\n  category   Category?      @relation(fields: [categoryId], references: [id])\n  assets     ProductAsset[]\n  tags       ProductTag[]\n  inventory  Inventory?\n  orderItems OrderItem[]\n\n  @@index([sellerId])\n  @@index([status])\n  @@index([sellerId, status])\n  @@map(\"products\")\n}\n\nenum ProductStatus {\n  draft\n  pending_review\n  active\n  paused\n  archived\n}\n\nmodel ProductAsset {\n  id        String   @id @default(dbgenerated(\"gen_random_uuid()\")) @db.Uuid\n  productId String   @map(\"product_id\") @db.Uuid\n  url       String\n  position  Int      @default(0)\n  createdAt DateTime @default(now()) @map(\"created_at\") @db.Timestamptz\n\n  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)\n\n  @@index([productId])\n  @@map(\"product_assets\")\n}\n\nmodel Tag {\n  id       String       @id @default(dbgenerated(\"gen_random_uuid()\")) @db.Uuid\n  slug     String       @unique\n  label    String\n  products ProductTag[]\n\n  @@map(\"tags\")\n}\n\nmodel ProductTag {\n  productId String @map(\"product_id\") @db.Uuid\n  tagId     String @map(\"tag_id\") @db.Uuid\n\n  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)\n  tag     Tag     @relation(fields: [tagId], references: [id], onDelete: Cascade)\n\n  @@id([productId, tagId])\n  @@map(\"product_tags\")\n}\n\nmodel Inventory {\n  productId        String   @id @map(\"product_id\") @db.Uuid\n  // Quantité totale en stock\n  stockQuantity    Int      @default(0) @map(\"stock_quantity\")\n  // Quantité réservée (commandes payées mais non encore expédiées).\n  // Invariant : reservedQuantity <= stockQuantity (enforced par SELECT FOR UPDATE)\n  reservedQuantity Int      @default(0) @map(\"reserved_quantity\")\n  updatedAt        DateTime @updatedAt @map(\"updated_at\") @db.Timestamptz\n\n  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)\n\n  @@map(\"inventory\")\n}\n\n// ─── Commandes ─────────────────────────────────────────────────────────────\n\nmodel Order {\n  id                      String       @id @default(dbgenerated(\"gen_random_uuid()\")) @db.Uuid\n  buyerUserId             String       @map(\"buyer_user_id\") @db.Uuid\n  status                  OrderStatus  @default(draft)\n  currency                String       @default(\"EUR\")\n  // Tous les montants en centimes EUR\n  itemsSubtotalAmount     Int          @map(\"items_subtotal_amount\")\n  serviceFeeAmount        Int          @default(0) @map(\"service_fee_amount\")\n  deliveryFeeAmount       Int          @default(0) @map(\"delivery_fee_amount\")\n  totalAmount             Int          @map(\"total_amount\")\n  giftMessage             String?      @map(\"gift_message\")\n  surpriseMode            SurpriseMode @map(\"surprise_mode\")\n  requestedDeliveryDate   DateTime     @map(\"requested_delivery_date\") @db.Date\n  // Snapshot immuable de l'adresse au moment de la commande.\n  // On n'utilise jamais de FK vers user_addresses pour garantir l'immuabilité.\n  deliveryAddressSnapshot Json         @map(\"delivery_address_snapshot\") @db.JsonB\n  stripePaymentIntentId   String?      @map(\"stripe_payment_intent_id\")\n  createdAt               DateTime     @default(now()) @map(\"created_at\") @db.Timestamptz\n  updatedAt               DateTime     @updatedAt @map(\"updated_at\") @db.Timestamptz\n\n  buyer          User               @relation(fields: [buyerUserId], references: [id])\n  items          OrderItem[]\n  statusEvents   OrderStatusEvent[]\n  payment        Payment?\n  fulfillment    Fulfillment?\n  supportTickets SupportTicket[]\n\n  @@index([buyerUserId, createdAt(sort: Desc)])\n  @@index([status, createdAt(sort: Desc)])\n  // Index partiel pour les requêtes sur commandes actives uniquement (exclut les terminées)\n  @@map(\"orders\")\n}\n\nenum OrderStatus {\n  draft\n  pending_payment\n  paid\n  accepted\n  in_preparation\n  shipped\n  delivered\n  cancelled\n  refunded\n}\n\nenum SurpriseMode {\n  total\n  controlled\n  manual\n}\n\nmodel OrderItem {\n  id              String   @id @default(dbgenerated(\"gen_random_uuid()\")) @db.Uuid\n  orderId         String   @map(\"order_id\") @db.Uuid\n  productId       String   @map(\"product_id\") @db.Uuid\n  // Snapshot du produit au moment de la commande (titre, prix, vendeur…)\n  productSnapshot Json     @map(\"product_snapshot\") @db.JsonB\n  quantity        Int      @default(1)\n  unitPriceAmount Int      @map(\"unit_price_amount\")\n  createdAt       DateTime @default(now()) @map(\"created_at\") @db.Timestamptz\n\n  order   Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)\n  product Product @relation(fields: [productId], references: [id])\n\n  @@index([orderId])\n  @@map(\"order_items\")\n}\n\nmodel OrderStatusEvent {\n  id         String       @id @default(dbgenerated(\"gen_random_uuid()\")) @db.Uuid\n  orderId    String       @map(\"order_id\") @db.Uuid\n  fromStatus OrderStatus? @map(\"from_status\")\n  toStatus   OrderStatus  @map(\"to_status\")\n  actorType  String       @map(\"actor_type\") // \"buyer\" | \"seller\" | \"system\" | \"admin\"\n  actorId    String?      @map(\"actor_id\") @db.Uuid\n  note       String?\n  createdAt  DateTime     @default(now()) @map(\"created_at\") @db.Timestamptz\n\n  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)\n\n  @@index([orderId, createdAt])\n  @@map(\"order_status_events\")\n}\n\n// ─── Paiements ─────────────────────────────────────────────────────────────\n\nmodel Payment {\n  id                    String        @id @default(dbgenerated(\"gen_random_uuid()\")) @db.Uuid\n  orderId               String        @unique @map(\"order_id\") @db.Uuid\n  stripePaymentIntentId String        @unique @map(\"stripe_payment_intent_id\")\n  status                PaymentStatus\n  amountCents           Int           @map(\"amount_cents\")\n  currency              String        @default(\"EUR\")\n  paidAt                DateTime?     @map(\"paid_at\") @db.Timestamptz\n  createdAt             DateTime      @default(now()) @map(\"created_at\") @db.Timestamptz\n\n  order   Order    @relation(fields: [orderId], references: [id])\n  refunds Refund[]\n\n  @@map(\"payments\")\n}\n\nenum PaymentStatus {\n  pending\n  succeeded\n  failed\n  disputed\n  refunded\n}\n\nmodel Refund {\n  id             String   @id @default(dbgenerated(\"gen_random_uuid()\")) @db.Uuid\n  paymentId      String   @map(\"payment_id\") @db.Uuid\n  stripeRefundId String   @unique @map(\"stripe_refund_id\")\n  amountCents    Int      @map(\"amount_cents\")\n  reason         String?\n  createdAt      DateTime @default(now()) @map(\"created_at\") @db.Timestamptz\n\n  payment Payment @relation(fields: [paymentId], references: [id])\n\n  @@map(\"refunds\")\n}\n\n// ─── Fulfillment ───────────────────────────────────────────────────────────\n\nmodel Fulfillment {\n  id             String            @id @default(dbgenerated(\"gen_random_uuid()\")) @db.Uuid\n  orderId        String            @unique @map(\"order_id\") @db.Uuid\n  sellerId       String            @map(\"seller_id\") @db.Uuid\n  status         FulfillmentStatus @default(pending)\n  // Timestamp limite d'acceptation par le vendeur (SLA : 2h après paiement)\n  acceptDeadline DateTime          @map(\"accept_deadline\") @db.Timestamptz\n  shippedAt      DateTime?         @map(\"shipped_at\") @db.Timestamptz\n  deliveredAt    DateTime?         @map(\"delivered_at\") @db.Timestamptz\n  trackingCode   String?           @map(\"tracking_code\")\n  proofPhotoUrl  String?           @map(\"proof_photo_url\")\n  createdAt      DateTime          @default(now()) @map(\"created_at\") @db.Timestamptz\n  updatedAt      DateTime          @updatedAt @map(\"updated_at\") @db.Timestamptz\n\n  order Order @relation(fields: [orderId], references: [id])\n\n  @@index([sellerId, status])\n  @@map(\"fulfillments\")\n}\n\nenum FulfillmentStatus {\n  pending\n  accepted\n  rejected\n  in_preparation\n  shipped\n  delivered\n}\n\n// ─── Payouts Vendeurs ──────────────────────────────────────────────────────\n\nmodel SellerPayout {\n  id             String       @id @default(dbgenerated(\"gen_random_uuid()\")) @db.Uuid\n  sellerId       String       @map(\"seller_id\") @db.Uuid\n  stripePayoutId String?      @unique @map(\"stripe_payout_id\")\n  amountCents    Int          @map(\"amount_cents\")\n  currency       String       @default(\"EUR\")\n  status         PayoutStatus @default(pending)\n  periodStart    DateTime     @map(\"period_start\") @db.Date\n  periodEnd      DateTime     @map(\"period_end\") @db.Date\n  processedAt    DateTime?    @map(\"processed_at\") @db.Timestamptz\n  createdAt      DateTime     @default(now()) @map(\"created_at\") @db.Timestamptz\n\n  seller Seller @relation(fields: [sellerId], references: [id])\n\n  @@index([sellerId, createdAt(sort: Desc)])\n  @@map(\"seller_payouts\")\n}\n\nenum PayoutStatus {\n  pending\n  processing\n  paid\n  failed\n}\n\n// ─── Support ───────────────────────────────────────────────────────────────\n\nmodel SupportTicket {\n  id        String         @id @default(dbgenerated(\"gen_random_uuid()\")) @db.Uuid\n  orderId   String         @map(\"order_id\") @db.Uuid\n  userId    String         @map(\"user_id\") @db.Uuid\n  status    TicketStatus   @default(open)\n  subject   String\n  priority  TicketPriority @default(normal)\n  createdAt DateTime       @default(now()) @map(\"created_at\") @db.Timestamptz\n  updatedAt DateTime       @updatedAt @map(\"updated_at\") @db.Timestamptz\n\n  order    Order            @relation(fields: [orderId], references: [id])\n  messages SupportMessage[]\n\n  @@index([userId])\n  @@index([status, priority])\n  @@map(\"support_tickets\")\n}\n\nenum TicketStatus {\n  open\n  in_progress\n  resolved\n  closed\n}\n\nenum TicketPriority {\n  low\n  normal\n  high\n  urgent\n}\n\nmodel SupportMessage {\n  id         String   @id @default(dbgenerated(\"gen_random_uuid()\")) @db.Uuid\n  ticketId   String   @map(\"ticket_id\") @db.Uuid\n  authorId   String   @map(\"author_id\") @db.Uuid\n  authorRole String   @map(\"author_role\") // \"user\" | \"agent\" | \"system\"\n  content    String\n  createdAt  DateTime @default(now()) @map(\"created_at\") @db.Timestamptz\n\n  ticket SupportTicket @relation(fields: [ticketId], references: [id], onDelete: Cascade)\n\n  @@index([ticketId, createdAt])\n  @@map(\"support_messages\")\n}\n\n// ─── Configuration Système ─────────────────────────────────────────────────\n\nmodel SystemConfig {\n  // Clé de configuration (ex: \"recommendation_weights\", \"curated_weights\")\n  key       String   @id\n  value     Json     @db.JsonB\n  updatedAt DateTime @updatedAt @map(\"updated_at\") @db.Timestamptz\n  updatedBy String?  @map(\"updated_by\") @db.Uuid\n\n  @@map(\"system_config\")\n}\n\n// ─── Audit Admin ───────────────────────────────────────────────────────────\n\nmodel AdminAction {\n  id         String   @id @default(dbgenerated(\"gen_random_uuid()\")) @db.Uuid\n  adminId    String   @map(\"admin_id\") @db.Uuid\n  action     String\n  targetType String   @map(\"target_type\")\n  targetId   String   @map(\"target_id\")\n  payload    Json?    @db.JsonB\n  createdAt  DateTime @default(now()) @map(\"created_at\") @db.Timestamptz\n\n  admin User @relation(fields: [adminId], references: [id])\n\n  @@index([adminId])\n  @@index([targetType, targetId])\n  @@map(\"admin_actions\")\n}\n",
  "inlineSchemaHash": "cb00e0e498576910c379dfe0fac0b6e67d1ce325e8c1332f71a4bc3308f7dabc",
  "copyEngine": true
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"dbName\":\"users\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"gen_random_uuid()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"email\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"phone\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"passwordHash\",\"dbName\":\"password_hash\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"firstName\",\"dbName\":\"first_name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lastName\",\"dbName\":\"last_name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"locale\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"fr\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"UserStatus\",\"default\":\"active\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"marketingConsent\",\"dbName\":\"marketing_consent\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"lastLoginAt\",\"dbName\":\"last_login_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"addresses\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"UserAddress\",\"relationName\":\"UserToUserAddress\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"relationships\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Relationship\",\"relationName\":\"RelationshipToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"orders\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Order\",\"relationName\":\"OrderToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"oauthAccounts\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"UserOauthAccount\",\"relationName\":\"UserToUserOauthAccount\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"refreshTokens\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"RefreshToken\",\"relationName\":\"RefreshTokenToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"adminActions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AdminAction\",\"relationName\":\"AdminActionToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"UserAddress\":{\"dbName\":\"user_addresses\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"gen_random_uuid()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"dbName\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"label\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"Domicile\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"line\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"city\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"postalCode\",\"dbName\":\"postal_code\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"country\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"BE\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isDefault\",\"dbName\":\"is_default\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"UserToUserAddress\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"UserOauthAccount\":{\"dbName\":\"user_oauth_accounts\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"gen_random_uuid()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"dbName\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"provider\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"OauthProvider\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"providerId\",\"dbName\":\"provider_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"UserToUserOauthAccount\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"provider\",\"providerId\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"provider\",\"providerId\"]}],\"isGenerated\":false},\"RefreshToken\":{\"dbName\":\"refresh_tokens\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"gen_random_uuid()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"dbName\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tokenHash\",\"dbName\":\"token_hash\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"familyId\",\"dbName\":\"family_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"expiresAt\",\"dbName\":\"expires_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"usedAt\",\"dbName\":\"used_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"RefreshTokenToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Relationship\":{\"dbName\":\"relationships\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"gen_random_uuid()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"dbName\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"displayName\",\"dbName\":\"display_name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"relationshipType\",\"dbName\":\"relationship_type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"RelationshipType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"birthdate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"preferences\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Json\",\"default\":\"{}\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"affinityScore\",\"dbName\":\"affinity_score\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Float\",\"default\":0.5,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"RelationshipToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"events\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"GiftingEvent\",\"relationName\":\"GiftingEventToRelationship\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"GiftingEvent\":{\"dbName\":\"gifting_events\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"gen_random_uuid()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"dbName\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"relationshipId\",\"dbName\":\"relationship_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"eventType\",\"dbName\":\"event_type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"eventDate\",\"dbName\":\"event_date\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isRecurring\",\"dbName\":\"is_recurring\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"relationship\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Relationship\",\"relationName\":\"GiftingEventToRelationship\",\"relationFromFields\":[\"relationshipId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reminders\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"EventReminder\",\"relationName\":\"EventReminderToGiftingEvent\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"EventReminder\":{\"dbName\":\"event_reminders\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"gen_random_uuid()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"eventId\",\"dbName\":\"event_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sentAt\",\"dbName\":\"sent_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"channel\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ReminderChannel\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"event\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"GiftingEvent\",\"relationName\":\"EventReminderToGiftingEvent\",\"relationFromFields\":[\"eventId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Seller\":{\"dbName\":\"sellers\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"gen_random_uuid()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"displayName\",\"dbName\":\"display_name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"legalName\",\"dbName\":\"legal_name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"vatNumber\",\"dbName\":\"vat_number\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"SellerStatus\",\"default\":\"pending\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"kybStatus\",\"dbName\":\"kyb_status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"KybStatus\",\"default\":\"pending\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"stripeAccountId\",\"dbName\":\"stripe_account_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reliabilityScore\",\"dbName\":\"reliability_score\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Float\",\"default\":1,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"users\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SellerUser\",\"relationName\":\"SellerToSellerUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"products\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Product\",\"relationName\":\"ProductToSeller\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"policy\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SellerPolicy\",\"relationName\":\"SellerToSellerPolicy\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"payouts\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SellerPayout\",\"relationName\":\"SellerToSellerPayout\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"SellerUser\":{\"dbName\":\"seller_users\",\"fields\":[{\"name\":\"sellerId\",\"dbName\":\"seller_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"dbName\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"role\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"owner\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"seller\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Seller\",\"relationName\":\"SellerToSellerUser\",\"relationFromFields\":[\"sellerId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":{\"name\":null,\"fields\":[\"sellerId\",\"userId\"]},\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"SellerPolicy\":{\"dbName\":\"seller_policies\",\"fields\":[{\"name\":\"sellerId\",\"dbName\":\"seller_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"slaPrepHours\",\"dbName\":\"sla_prep_hours\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":4,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"slaDeliveryHours\",\"dbName\":\"sla_delivery_hours\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":24,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deliveryZoneGeoJson\",\"dbName\":\"delivery_zone_geojson\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cutoffTimeLocal\",\"dbName\":\"cutoff_time_local\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"17:00\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"seller\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Seller\",\"relationName\":\"SellerToSellerPolicy\",\"relationFromFields\":[\"sellerId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Category\":{\"dbName\":\"categories\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"gen_random_uuid()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"slug\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"products\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Product\",\"relationName\":\"CategoryToProduct\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Product\":{\"dbName\":\"products\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"gen_random_uuid()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sellerId\",\"dbName\":\"seller_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"categoryId\",\"dbName\":\"category_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"ProductStatus\",\"default\":\"draft\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"priceAmount\",\"dbName\":\"price_amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"currency\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"EUR\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isSurpriseReady\",\"dbName\":\"is_surprise_ready\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isLastMinuteOk\",\"dbName\":\"is_last_minute_ok\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"preparationTimeMin\",\"dbName\":\"preparation_time_min\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"seller\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Seller\",\"relationName\":\"ProductToSeller\",\"relationFromFields\":[\"sellerId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"category\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Category\",\"relationName\":\"CategoryToProduct\",\"relationFromFields\":[\"categoryId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"assets\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ProductAsset\",\"relationName\":\"ProductToProductAsset\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tags\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ProductTag\",\"relationName\":\"ProductToProductTag\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"inventory\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Inventory\",\"relationName\":\"InventoryToProduct\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"orderItems\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"OrderItem\",\"relationName\":\"OrderItemToProduct\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"ProductAsset\":{\"dbName\":\"product_assets\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"gen_random_uuid()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"productId\",\"dbName\":\"product_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"url\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"position\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"product\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Product\",\"relationName\":\"ProductToProductAsset\",\"relationFromFields\":[\"productId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Tag\":{\"dbName\":\"tags\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"gen_random_uuid()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"slug\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"label\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"products\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ProductTag\",\"relationName\":\"ProductTagToTag\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"ProductTag\":{\"dbName\":\"product_tags\",\"fields\":[{\"name\":\"productId\",\"dbName\":\"product_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tagId\",\"dbName\":\"tag_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"product\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Product\",\"relationName\":\"ProductToProductTag\",\"relationFromFields\":[\"productId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tag\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Tag\",\"relationName\":\"ProductTagToTag\",\"relationFromFields\":[\"tagId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":{\"name\":null,\"fields\":[\"productId\",\"tagId\"]},\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Inventory\":{\"dbName\":\"inventory\",\"fields\":[{\"name\":\"productId\",\"dbName\":\"product_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"stockQuantity\",\"dbName\":\"stock_quantity\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reservedQuantity\",\"dbName\":\"reserved_quantity\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"product\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Product\",\"relationName\":\"InventoryToProduct\",\"relationFromFields\":[\"productId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Order\":{\"dbName\":\"orders\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"gen_random_uuid()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"buyerUserId\",\"dbName\":\"buyer_user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"OrderStatus\",\"default\":\"draft\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"currency\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"EUR\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"itemsSubtotalAmount\",\"dbName\":\"items_subtotal_amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"serviceFeeAmount\",\"dbName\":\"service_fee_amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deliveryFeeAmount\",\"dbName\":\"delivery_fee_amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalAmount\",\"dbName\":\"total_amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"giftMessage\",\"dbName\":\"gift_message\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"surpriseMode\",\"dbName\":\"surprise_mode\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SurpriseMode\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"requestedDeliveryDate\",\"dbName\":\"requested_delivery_date\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deliveryAddressSnapshot\",\"dbName\":\"delivery_address_snapshot\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"stripePaymentIntentId\",\"dbName\":\"stripe_payment_intent_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"buyer\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"OrderToUser\",\"relationFromFields\":[\"buyerUserId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"items\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"OrderItem\",\"relationName\":\"OrderToOrderItem\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"statusEvents\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"OrderStatusEvent\",\"relationName\":\"OrderToOrderStatusEvent\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"payment\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Payment\",\"relationName\":\"OrderToPayment\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fulfillment\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Fulfillment\",\"relationName\":\"FulfillmentToOrder\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"supportTickets\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SupportTicket\",\"relationName\":\"OrderToSupportTicket\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"OrderItem\":{\"dbName\":\"order_items\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"gen_random_uuid()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"orderId\",\"dbName\":\"order_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"productId\",\"dbName\":\"product_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"productSnapshot\",\"dbName\":\"product_snapshot\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"quantity\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":1,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"unitPriceAmount\",\"dbName\":\"unit_price_amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"order\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Order\",\"relationName\":\"OrderToOrderItem\",\"relationFromFields\":[\"orderId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"product\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Product\",\"relationName\":\"OrderItemToProduct\",\"relationFromFields\":[\"productId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"OrderStatusEvent\":{\"dbName\":\"order_status_events\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"gen_random_uuid()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"orderId\",\"dbName\":\"order_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fromStatus\",\"dbName\":\"from_status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"OrderStatus\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"toStatus\",\"dbName\":\"to_status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"OrderStatus\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"actorType\",\"dbName\":\"actor_type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"actorId\",\"dbName\":\"actor_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"note\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"order\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Order\",\"relationName\":\"OrderToOrderStatusEvent\",\"relationFromFields\":[\"orderId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Payment\":{\"dbName\":\"payments\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"gen_random_uuid()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"orderId\",\"dbName\":\"order_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"stripePaymentIntentId\",\"dbName\":\"stripe_payment_intent_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PaymentStatus\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"amountCents\",\"dbName\":\"amount_cents\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"currency\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"EUR\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"paidAt\",\"dbName\":\"paid_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"order\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Order\",\"relationName\":\"OrderToPayment\",\"relationFromFields\":[\"orderId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"refunds\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Refund\",\"relationName\":\"PaymentToRefund\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Refund\":{\"dbName\":\"refunds\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"gen_random_uuid()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"paymentId\",\"dbName\":\"payment_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"stripeRefundId\",\"dbName\":\"stripe_refund_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"amountCents\",\"dbName\":\"amount_cents\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reason\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"payment\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Payment\",\"relationName\":\"PaymentToRefund\",\"relationFromFields\":[\"paymentId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Fulfillment\":{\"dbName\":\"fulfillments\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"gen_random_uuid()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"orderId\",\"dbName\":\"order_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sellerId\",\"dbName\":\"seller_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"FulfillmentStatus\",\"default\":\"pending\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"acceptDeadline\",\"dbName\":\"accept_deadline\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"shippedAt\",\"dbName\":\"shipped_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deliveredAt\",\"dbName\":\"delivered_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"trackingCode\",\"dbName\":\"tracking_code\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"proofPhotoUrl\",\"dbName\":\"proof_photo_url\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"order\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Order\",\"relationName\":\"FulfillmentToOrder\",\"relationFromFields\":[\"orderId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"SellerPayout\":{\"dbName\":\"seller_payouts\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"gen_random_uuid()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sellerId\",\"dbName\":\"seller_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"stripePayoutId\",\"dbName\":\"stripe_payout_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"amountCents\",\"dbName\":\"amount_cents\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"currency\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"EUR\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"PayoutStatus\",\"default\":\"pending\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"periodStart\",\"dbName\":\"period_start\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"periodEnd\",\"dbName\":\"period_end\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"processedAt\",\"dbName\":\"processed_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"seller\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Seller\",\"relationName\":\"SellerToSellerPayout\",\"relationFromFields\":[\"sellerId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"SupportTicket\":{\"dbName\":\"support_tickets\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"gen_random_uuid()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"orderId\",\"dbName\":\"order_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"dbName\":\"user_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"TicketStatus\",\"default\":\"open\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"subject\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"priority\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"TicketPriority\",\"default\":\"normal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"order\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Order\",\"relationName\":\"OrderToSupportTicket\",\"relationFromFields\":[\"orderId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"messages\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SupportMessage\",\"relationName\":\"SupportMessageToSupportTicket\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"SupportMessage\":{\"dbName\":\"support_messages\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"gen_random_uuid()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ticketId\",\"dbName\":\"ticket_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"authorId\",\"dbName\":\"author_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"authorRole\",\"dbName\":\"author_role\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"content\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ticket\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SupportTicket\",\"relationName\":\"SupportMessageToSupportTicket\",\"relationFromFields\":[\"ticketId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"SystemConfig\":{\"dbName\":\"system_config\",\"fields\":[{\"name\":\"key\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"value\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"updatedBy\",\"dbName\":\"updated_by\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"AdminAction\":{\"dbName\":\"admin_actions\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"dbgenerated\",\"args\":[\"gen_random_uuid()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"adminId\",\"dbName\":\"admin_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"action\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"targetType\",\"dbName\":\"target_type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"targetId\",\"dbName\":\"target_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"payload\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"admin\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"AdminActionToUser\",\"relationFromFields\":[\"adminId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false}},\"enums\":{\"UserStatus\":{\"values\":[{\"name\":\"active\",\"dbName\":null},{\"name\":\"suspended\",\"dbName\":null},{\"name\":\"deleted\",\"dbName\":null}],\"dbName\":null},\"OauthProvider\":{\"values\":[{\"name\":\"google\",\"dbName\":null},{\"name\":\"apple\",\"dbName\":null}],\"dbName\":null},\"RelationshipType\":{\"values\":[{\"name\":\"partner\",\"dbName\":null},{\"name\":\"friend\",\"dbName\":null},{\"name\":\"parent\",\"dbName\":null},{\"name\":\"child\",\"dbName\":null},{\"name\":\"colleague\",\"dbName\":null},{\"name\":\"other\",\"dbName\":null}],\"dbName\":null},\"ReminderChannel\":{\"values\":[{\"name\":\"push\",\"dbName\":null},{\"name\":\"email\",\"dbName\":null},{\"name\":\"sms\",\"dbName\":null}],\"dbName\":null},\"SellerStatus\":{\"values\":[{\"name\":\"pending\",\"dbName\":null},{\"name\":\"active\",\"dbName\":null},{\"name\":\"suspended\",\"dbName\":null}],\"dbName\":null},\"KybStatus\":{\"values\":[{\"name\":\"pending\",\"dbName\":null},{\"name\":\"submitted\",\"dbName\":null},{\"name\":\"approved\",\"dbName\":null},{\"name\":\"rejected\",\"dbName\":null}],\"dbName\":null},\"ProductStatus\":{\"values\":[{\"name\":\"draft\",\"dbName\":null},{\"name\":\"pending_review\",\"dbName\":null},{\"name\":\"active\",\"dbName\":null},{\"name\":\"paused\",\"dbName\":null},{\"name\":\"archived\",\"dbName\":null}],\"dbName\":null},\"OrderStatus\":{\"values\":[{\"name\":\"draft\",\"dbName\":null},{\"name\":\"pending_payment\",\"dbName\":null},{\"name\":\"paid\",\"dbName\":null},{\"name\":\"accepted\",\"dbName\":null},{\"name\":\"in_preparation\",\"dbName\":null},{\"name\":\"shipped\",\"dbName\":null},{\"name\":\"delivered\",\"dbName\":null},{\"name\":\"cancelled\",\"dbName\":null},{\"name\":\"refunded\",\"dbName\":null}],\"dbName\":null},\"SurpriseMode\":{\"values\":[{\"name\":\"total\",\"dbName\":null},{\"name\":\"controlled\",\"dbName\":null},{\"name\":\"manual\",\"dbName\":null}],\"dbName\":null},\"PaymentStatus\":{\"values\":[{\"name\":\"pending\",\"dbName\":null},{\"name\":\"succeeded\",\"dbName\":null},{\"name\":\"failed\",\"dbName\":null},{\"name\":\"disputed\",\"dbName\":null},{\"name\":\"refunded\",\"dbName\":null}],\"dbName\":null},\"FulfillmentStatus\":{\"values\":[{\"name\":\"pending\",\"dbName\":null},{\"name\":\"accepted\",\"dbName\":null},{\"name\":\"rejected\",\"dbName\":null},{\"name\":\"in_preparation\",\"dbName\":null},{\"name\":\"shipped\",\"dbName\":null},{\"name\":\"delivered\",\"dbName\":null}],\"dbName\":null},\"PayoutStatus\":{\"values\":[{\"name\":\"pending\",\"dbName\":null},{\"name\":\"processing\",\"dbName\":null},{\"name\":\"paid\",\"dbName\":null},{\"name\":\"failed\",\"dbName\":null}],\"dbName\":null},\"TicketStatus\":{\"values\":[{\"name\":\"open\",\"dbName\":null},{\"name\":\"in_progress\",\"dbName\":null},{\"name\":\"resolved\",\"dbName\":null},{\"name\":\"closed\",\"dbName\":null}],\"dbName\":null},\"TicketPriority\":{\"values\":[{\"name\":\"low\",\"dbName\":null},{\"name\":\"normal\",\"dbName\":null},{\"name\":\"high\",\"dbName\":null},{\"name\":\"urgent\",\"dbName\":null}],\"dbName\":null}},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = undefined

config.injectableEdgeEnv = () => ({
  parsed: {
    DATABASE_URL: typeof globalThis !== 'undefined' && globalThis['DATABASE_URL'] || typeof process !== 'undefined' && process.env && process.env.DATABASE_URL || undefined
  }
})

if (typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined) {
  Debug.enable(typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined)
}

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

