export const resolveImageUrl = (path?: string): string => {
  if (!path) return "https://placehold.co/400x400?text=No+Image";
  
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  
  if (path.startsWith("blob:")) {
    return path;
  }

  // Handle paths that might incorrectly have a double slash
  const cleanPath = path.startsWith("/") ? path.substring(1) : path;
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5165/api/v1';
  
  return `${baseUrl}/image/${cleanPath}`;
};
