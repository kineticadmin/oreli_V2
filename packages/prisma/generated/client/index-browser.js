
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


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

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

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
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
