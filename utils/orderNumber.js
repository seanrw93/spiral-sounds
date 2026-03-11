export const generateOrderNumber = () => {
  return "REF-" + Math.random().toString(36).substring(2, 10).toUpperCase();
}