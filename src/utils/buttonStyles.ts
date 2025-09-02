// Button color constants
export const BUTTON_COLORS = {
  primary: '#8C7E9C',      // Primary actions (Save, Update, Create, etc.)
  secondary: '#553C9A',    // Secondary actions (Edit, View, etc.)
  delete: '#C24C4C',       // Destructive actions (Delete, Remove, etc.)
} as const;

// Button style classes
export const buttonStyles = {
  primary: `bg-[#8C7E9C] hover:bg-[#7A6B8A] text-white`,
  secondary: `bg-[#553C9A] hover:bg-[#4A2F8A] text-white`,
  delete: `bg-[#C24C4C] hover:bg-[#7A3636] text-white`,
  outline: `border border-[#8C7E9C] text-[#8C7E9C] bg-white hover:bg-[#8C7E9C] hover:text-white`,
  outlineSecondary: `border border-[#553C9A] text-[#553C9A] bg-white hover:bg-[#553C9A] hover:text-white`,
  outlineDelete: `border border-[#C24C4C] text-[#C24C4C] bg-white hover:bg-[#C24C4C] hover:text-white`,
  disabled: `bg-gray-400 text-white cursor-not-allowed`,
} as const;

// Common button base classes
export const buttonBase = `px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2`;

// Complete button classes
export const getButtonClasses = (variant: keyof typeof buttonStyles, disabled = false) => {
  if (disabled) {
    return `${buttonBase} ${buttonStyles.disabled}`;
  }
  return `${buttonBase} ${buttonStyles[variant]}`;
};
