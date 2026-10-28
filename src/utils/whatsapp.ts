import { STORE_SETTINGS } from '../config/settings';
import { CartItem } from '../types/product';

export interface WhatsAppCartResult {
  success: boolean;
  message?: string;
  url?: string;
  total?: number;
}

/**
 * Generates formatted order text and WhatsApp URL for all items in the shopping cart.
 * Uses the business WhatsApp number (919014992914) configured centrally in STORE_SETTINGS.
 */
export function openWhatsAppCartOrder(cartItems: CartItem[]): WhatsAppCartResult {
  if (!cartItems || cartItems.length === 0) {
    return {
      success: false,
      message: 'Your cart is empty. Please add items before placing an order.',
    };
  }

  // Validate that all items in cart are available
  const unavailableItems = cartItems.filter((item) => !item.product.isAvailable);
  if (unavailableItems.length > 0) {
    const names = unavailableItems.map((i) => i.product.name).join(', ');
    return {
      success: false,
      message: `The following item(s) are currently out of stock: ${names}. Please remove them to proceed.`,
    };
  }

  const phone = STORE_SETTINGS.whatsappNumber; // '919014992914'
  const currency = STORE_SETTINGS.currencySymbol;

  let totalAmount = 0;
  const itemsText = cartItems
    .map((item, index) => {
      const itemSubtotal = item.unitPrice * item.quantity;
      totalAmount += itemSubtotal;
      const unitLabel = item.product.category === 'snacks' ? 'pack(s)' : 'jar(s)';
      return `${index + 1}. *${item.product.name}*\n   • Weight: ${item.selectedWeight}\n   • Quantity: ${item.quantity} ${unitLabel}\n   • Price: ${currency}${item.unitPrice} × ${item.quantity} = *${currency}${itemSubtotal}*`;
    })
    .join('\n\n');

  const textMessage =
    `Hello ${STORE_SETTINGS.brandName} team!\n\n` +
    `I would like to place an order from your shop:\n\n` +
    `${itemsText}\n\n` +
    `--------------------------------\n` +
    `*Total Estimated Order: ${currency}${totalAmount}*\n` +
    `--------------------------------\n\n` +
    `Could you please confirm current batch availability, payment options, and doorstep delivery timeline? Thank you!`;

  const encodedUrl = `https://wa.me/${phone}?text=${encodeURIComponent(textMessage)}`;

  try {
    window.open(encodedUrl, '_blank', 'noopener,noreferrer');
  } catch (err) {
    console.error('Failed to open WhatsApp window:', err);
  }

  return {
    success: true,
    url: encodedUrl,
    total: totalAmount,
  };
}

/**
 * Generates direct WhatsApp chat URL for general inquiries from the Contact section.
 */
export function getWhatsAppContactUrl(): string {
  const phone = STORE_SETTINGS.whatsappNumber; // '919014992914'
  const message =
    `Hello ${STORE_SETTINGS.brandName} team!\n\n` +
    `I would like to inquire about ordering your homemade pickles and snacks. Could you please share today's batch availability and delivery details? Thank you!`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
