
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Các màu chủ đạo trong thiết kế
export const colors = {
  primary: {
    light: '#4CAF50',
    dark: '#38A169',
    hover: {
      light: '#43A047',
      dark: '#2F855A'
    }
  },
  secondary: {
    light: '#F5F5F5',
    dark: '#2D3748',
    hover: {
      light: '#E0E0E0',
      dark: '#1A202C'
    }
  },
  accent: {
    light: '#2196F3',
    dark: '#3182CE',
    hover: {
      light: '#1E88E5',
      dark: '#2B6CB0'
    }
  }
}

