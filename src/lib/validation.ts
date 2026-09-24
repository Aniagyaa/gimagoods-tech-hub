export const normalizePhone = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("233") && digits.length === 12) return `+${digits}`;
  if (digits.startsWith("0") && digits.length === 10) return `+233${digits.slice(1)}`;
  if (digits.length >= 10 && digits.length <= 15) return `+${digits}`;
  return null;
};

export const authErrorMessage = (message: string) => {
  const text = message.toLowerCase();
  if (text.includes("invalid login")) return "The contact number or password is incorrect.";
  if (text.includes("phone provider") || text.includes("sms")) return "Phone verification is not available yet. Please ask GIMATech to finish SMS setup.";
  if (text.includes("already registered") || text.includes("already exists")) return "An account already exists for this contact number or username.";
  if (text.includes("password")) return "Please use a stronger password with at least 8 characters.";
  return "We could not complete that request. Please check your details and try again.";
};