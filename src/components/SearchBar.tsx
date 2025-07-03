import React, { useState, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/utils/translations";
import { cn } from "@/lib/utils";
import { performSearch, getSearchSuggestions, SearchResult } from "@/services/searchService";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  className?: string;
  onSearch?: (query: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  className,
  onSearch,
  placeholder,
  autoFocus = false
}) => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [quickResults, setQuickResults] = useState<SearchResult[]>([]);
  
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeout = useRef<NodeJS.Timeout>();
  const suggestionTimeout = useRef<NodeJS.Timeout>();

  const textColor = theme === "dark" ? "text-dseza-dark-main-text" : "text-dseza-light-main-text";
  const placeholderColor = theme === "dark" ? "placeholder-dseza-dark-secondary-text" : "placeholder-dseza-light-secondary-text";
  const focusBorderColor = theme === "dark" ? "focus:border-dseza-dark-primary-accent" : "focus:border-dseza-light-primary-accent";
  const focusShadow = theme === "dark" ? "focus:shadow-[0_0_0_2px_rgba(25,219,207,0.2)]" : "focus:shadow-[0_0_0_2px_rgba(65,102,40,0.2)]";
  const inputBg = theme === "dark" ? "bg-dseza-dark-secondary-bg/60" : "bg-white/60";
  const inputBorder = theme === "dark" ? "border-dseza-dark-border/50" : "border-gray-300/50";
  const dropdownBg = theme === "dark" ? "bg-dseza-dark-secondary-bg" : "bg-white";
  const dropdownBorder = theme === "dark" ? "border-dseza-dark-border" : "border-gray-200";
  const hoverBg = theme === "dark" ? "hover:bg-dseza-dark-hover" : "hover:bg-gray-50";

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dseza_recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = (searchQuery: string) => {
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('dseza_recent_searches', JSON.stringify(updated));
  };

  // Handle input change with debounced search
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    // Show suggestions dropdown
    if (newQuery.length > 0) {
      setShowSuggestions(true);
      
      // Get quick results after 300ms delay
      searchTimeout.current = setTimeout(() => {
        getQuickResults(newQuery);
      }, 300);
    } else {
      setShowSuggestions(false);
      setQuickResults([]);
    }
  };

  // Get quick search results for dropdown
  const getQuickResults = async (searchQuery: string) => {
    if (searchQuery.length < 2) return;
    
    setIsSearching(true);
    try {
      const results = await performSearch(searchQuery, 'all', 1, 5);
      setQuickResults(results.results);
    } catch (error) {
      console.error('Error getting quick results:', error);
      setQuickResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search submission
  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query;
    if (!finalQuery.trim()) return;
    
    const trimmedQuery = finalQuery.trim();
    saveRecentSearch(trimmedQuery);
    setShowSuggestions(false);
    
    if (onSearch) {
      onSearch(trimmedQuery);
    } else {
      // Navigate to search results page
      navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    setShowSuggestions(false);
    navigate(result.url);
  };

  // Clear search
  const clearSearch = () => {
    setQuery("");
    setShowSuggestions(false);
    setQuickResults([]);
    inputRef.current?.focus();
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className={`h-5 w-5 ${theme === "dark" ? "text-dseza-dark-secondary-text" : "text-dseza-light-secondary-text"}`} />
        </div>
        
        <input
          ref={inputRef}
          id="global-search"
          name="search"
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          onFocus={() => query.length > 0 && setShowSuggestions(true)}
          autoFocus={autoFocus}
          placeholder={placeholder || t('logoSearchBar.searchPlaceholder')}
          autoComplete="off"
          className={cn(
            "w-full py-3 pl-10 pr-12 rounded-lg transition-all duration-300 outline-none border",
            inputBg,
            inputBorder,
            textColor,
            placeholderColor,
            focusBorderColor,
            focusShadow
          )}
        />
        
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {isSearching ? (
            <Loader2 className="h-5 w-5 animate-spin text-dseza-light-primary-accent" />
          ) : query.length > 0 ? (
            <button
              onClick={clearSearch}
              className={`h-5 w-5 ${theme === "dark" ? "text-dseza-dark-secondary-text hover:text-dseza-dark-primary-accent" : "text-dseza-light-secondary-text hover:text-dseza-light-primary-accent"} transition-colors`}
            >
              <X className="h-full w-full" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && (
        <div className={cn(
          "absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-lg z-50 max-h-96 overflow-y-auto",
          dropdownBg,
          dropdownBorder
        )}>
          {/* Recent Searches */}
          {query.length === 0 && recentSearches.length > 0 && (
            <div className="p-3">
              <div className={`text-sm font-medium mb-2 ${theme === "dark" ? "text-dseza-dark-secondary-text" : "text-dseza-light-secondary-text"}`}>
                {t('search.recentSearches')}
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                    textColor,
                    hoverBg
                  )}
                >
                  <Search className="h-4 w-4 inline mr-2" />
                  {search}
                </button>
              ))}
            </div>
          )}

          {/* Quick Results */}
          {quickResults.length > 0 && (
            <div className="p-3 border-t border-gray-200">
              <div className={`text-sm font-medium mb-2 ${theme === "dark" ? "text-dseza-dark-secondary-text" : "text-dseza-light-secondary-text"}`}>
                {t('search.quickResults')}
              </div>
              {quickResults.map((result, index) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className={cn(
                    "w-full text-left px-3 py-3 rounded-md transition-colors",
                    hoverBg
                  )}
                >
                  <div className="flex items-start space-x-3">
                    {result.imageUrl && (
                      <img
                        src={result.imageUrl}
                        alt={result.title}
                        className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium text-sm line-clamp-1 ${textColor}`}>
                        {result.title}
                      </div>
                      {result.excerpt && (
                        <div className={`text-xs mt-1 line-clamp-2 ${theme === "dark" ? "text-dseza-dark-secondary-text" : "text-dseza-light-secondary-text"}`}
                             dangerouslySetInnerHTML={{ __html: result.excerpt }}
                        />
                      )}
                      {result.category && (
                        <div className={`text-xs mt-1 ${theme === "dark" ? "text-dseza-dark-primary-accent" : "text-dseza-light-primary-accent"}`}>
                          {result.category.name}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
              
              {/* View All Results */}
              <button
                onClick={() => handleSearch()}
                className={cn(
                  "w-full text-center px-3 py-2 mt-2 rounded-md text-sm font-medium transition-colors",
                  theme === "dark" ? "text-dseza-dark-primary-accent hover:bg-dseza-dark-hover" : "text-dseza-light-primary-accent hover:bg-gray-50"
                )}
              >
                {t('search.viewAllResults')}
              </button>
            </div>
          )}

          {/* No Results */}
          {query.length >= 2 && !isSearching && quickResults.length === 0 && (
            <div className="p-4 text-center">
              <div className={`text-sm ${theme === "dark" ? "text-dseza-dark-secondary-text" : "text-dseza-light-secondary-text"}`}>
                {t('search.noResults')}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar; 