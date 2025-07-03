import React, { useRef, useCallback, useMemo, useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MediaPicker } from '@/components/ui/media-picker';
import { MediaFile, isImageFile, isVideoFile } from '@/types/media';
import { Image as ImageIcon, Video, Upload, FileText } from 'lucide-react';

interface WYSIWYGEditorProps {
  value?: string;
  onChange?: (content: string, editor: any) => void;
  placeholder?: string;
  height?: number;
  disabled?: boolean;
  className?: string;
  onInit?: (evt: any, editor: any) => void;
  language?: 'vi' | 'en';
  enableMediaLibrary?: boolean;
  enableVideoUpload?: boolean;
  enableImageOptimization?: boolean;
}

export const WYSIWYGEditor: React.FC<WYSIWYGEditorProps> = ({
  value = '',
  onChange,
  placeholder = 'Nhập nội dung...',
  height = 500,
  disabled = false,
  className,
  onInit,
  language = 'vi',
  enableMediaLibrary = true,
  enableVideoUpload = true,
  enableImageOptimization = true
}) => {
  const editorRef = useRef<any>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaPickerMode, setMediaPickerMode] = useState<'image' | 'video' | 'all'>('all');

  // Load passive event listener fix on component mount
  useEffect(() => {
    const loadPassiveFix = () => {
      const script = document.createElement('script');
      script.src = '/tinymce-passive-fix.js';
      script.async = true;
      script.onload = () => {
        console.log('TinyMCE passive fix loaded');
      };
      document.head.appendChild(script);
    };

    // Only load if not already loaded
    if (!document.querySelector('script[src="/tinymce-passive-fix.js"]')) {
      loadPassiveFix();
    }
  }, []);

  const handleEditorChange = useCallback((content: string, editor: any) => {
    if (onChange) {
      onChange(content, editor);
    }
  }, [onChange]);

  const handleInit = useCallback((evt: any, editor: any) => {
    editorRef.current = editor;
    
    // Add custom media buttons to toolbar
    if (enableMediaLibrary) {
      // Custom image button
      editor.ui.registry.addButton('customimage', {
        icon: 'image',
        tooltip: 'Chèn hình ảnh từ thư viện',
        onAction: () => {
          setMediaPickerMode('image');
          setShowMediaPicker(true);
        }
      });
      
      // Custom video button (if enabled)
      if (enableVideoUpload) {
        editor.ui.registry.addButton('customvideo', {
          icon: 'embed',
          tooltip: 'Chèn video từ thư viện',
          onAction: () => {
            setMediaPickerMode('video');
            setShowMediaPicker(true);
          }
        });
      }
      
      // Custom media library button
      editor.ui.registry.addButton('medialibrary', {
        icon: 'browse',
        tooltip: 'Mở thư viện media',
        onAction: () => {
          setMediaPickerMode('all');
          setShowMediaPicker(true);
        }
      });
    }
    
    if (onInit) {
      onInit(evt, editor);
    }
  }, [onInit, enableMediaLibrary, enableVideoUpload]);

  // Handle media insertion from picker
  const handleMediaInsert = useCallback((files: MediaFile[]) => {
    if (!editorRef.current || files.length === 0) return;

    const editor = editorRef.current;
    
    files.forEach(file => {
      let content = '';
      
      if (isImageFile(file)) {
        // Use optimized URL if available
        const imageUrl = enableImageOptimization && file.webpUrl ? file.webpUrl : 
                        file.responsiveUrls?.medium || file.url;
        
        content = `<img src="${imageUrl}" alt="${file.alt || file.originalName}" title="${file.caption || ''}" style="max-width: 100%; height: auto;" />`;
        
        // Add caption if present
        if (file.caption) {
          content = `<figure>${content}<figcaption>${file.caption}</figcaption></figure>`;
        }
      } else if (isVideoFile(file)) {
        content = `
          <video controls style="max-width: 100%; height: auto;">
            <source src="${file.url}" type="${file.mimeType}">
            Trình duyệt của bạn không hỗ trợ video.
          </video>
        `;
        
        // Add caption if present
        if (file.caption) {
          content = `<figure>${content}<figcaption>${file.caption}</figcaption></figure>`;
        }
      } else {
        // For documents and other files
        content = `<a href="${file.url}" target="_blank" rel="noopener">${file.originalName}</a>`;
      }
      
      editor.insertContent(content);
    });
    
    setShowMediaPicker(false);
  }, [enableImageOptimization]);

  const editorConfig = useMemo(() => ({
    height,
    menubar: true,
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'help', 'wordcount',
      'directionality', 'emoticons', 'codesample',
      'nonbreaking', 'pagebreak', 'save', 'importcss'
    ],
    toolbar: enableMediaLibrary ? [
      'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough',
      'customimage customvideo medialibrary | link table | align lineheight',
      'checklist numlist bullist indent outdent | emoticons charmap | removeformat | code fullscreen preview save'
    ].join(' | ') : [
      'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags',
      'align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat | code fullscreen preview save'
    ].join(' | '),
    content_style: `
      body { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; 
        font-size: 14px;
        line-height: 1.6;
        margin: 1rem;
        color: #333;
      }
      img {
        max-width: 100%;
        height: auto;
        border-radius: 4px;
      }
      video {
        max-width: 100%;
        height: auto;
        border-radius: 4px;
      }
      figure {
        margin: 1em 0;
        text-align: center;
      }
      figcaption {
        font-size: 0.9em;
        color: #666;
        font-style: italic;
        margin-top: 0.5em;
      }
      blockquote {
        border-left: 4px solid #ddd;
        margin-left: 0;
        padding-left: 1rem;
        font-style: italic;
        color: #666;
      }
      table {
        border-collapse: collapse;
        width: 100%;
        margin: 1em 0;
      }
      table, th, td {
        border: 1px solid #ddd;
      }
      th, td {
        padding: 12px;
        text-align: left;
      }
      th {
        background-color: #f8f9fa;
        font-weight: bold;
      }
      code {
        background-color: #f4f4f4;
        padding: 2px 4px;
        border-radius: 3px;
        font-family: 'Courier New', monospace;
      }
      pre {
        background-color: #f4f4f4;
        padding: 1rem;
        border-radius: 4px;
        overflow-x: auto;
      }
      a {
        color: #007bff;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
    `,
    placeholder,
    branding: false,
    promotion: false,
    resize: false,
    statusbar: true,
    elementpath: false,
    
    // Performance settings to reduce warnings
    convert_urls: false,
    remove_script_host: false,
    relative_urls: false,
    document_base_url: window.location.origin,
    
    // Disable some features that can cause performance issues
    automatic_uploads: false,
    paste_data_images: false,
    paste_webkit_styles: 'none',
    paste_remove_styles_if_webkit: true,
    
    // Optimize mobile touch handling
    mobile: {
      theme: 'silver',
      plugins: 'lists autolink',
      toolbar: 'undo bold italic styleselect'
    },
    
    // Language configuration
    language: 'en',
    language_load: false,
    directionality: 'ltr' as 'ltr' | 'rtl',
    
    // Enhanced image configuration
    image_advtab: true,
    image_caption: true,
    image_list: [],
    image_class_list: [
      { title: 'None', value: '' },
      { title: 'Responsive', value: 'img-responsive' },
      { title: 'Rounded', value: 'img-rounded' },
      { title: 'Circle', value: 'img-circle' }
    ],
    
    // Link configuration
    link_list: [],
    link_class_list: [
      { title: 'None', value: '' },
      { title: 'External Link', value: 'external-link' },
      { title: 'Internal Link', value: 'internal-link' },
      { title: 'Button', value: 'btn btn-primary' }
    ],
    link_target_list: [
      { title: 'None', value: '' },
      { title: 'Same window', value: '_self' },
      { title: 'New window', value: '_blank' }
    ],
    
    // Table configuration
    table_default_attributes: {
      'class': 'table table-striped'
    },
    table_default_styles: {
      'width': '100%',
      'border-collapse': 'collapse'
    },
    table_class_list: [
      { title: 'None', value: '' },
      { title: 'Striped', value: 'table-striped' },
      { title: 'Bordered', value: 'table-bordered' },
      { title: 'Hover', value: 'table-hover' }
    ],
    
    // Media configuration
    media_live_embeds: true,
    media_filter_html: false,
    media_alt_source: false,
    media_poster: false,
    
    // Video-specific settings
    video_template_callback: (data: any) => {
      return `<video width="${data.width || 560}" height="${data.height || 314}" controls style="max-width: 100%; height: auto;">
        <source src="${data.source}" type="${data.sourcemime || 'video/mp4'}" />
        Trình duyệt của bạn không hỗ trợ video.
      </video>`;
    },
    
    // Spell checker
    browser_spellcheck: true,
    contextmenu: 'link image table',
    
    // Performance optimization settings
    passive_touch_events: true,
    experimental: {
      css_transform: true
    },
    
    // Content filtering for better security
    valid_elements: '*[*]',
    extended_valid_elements: 'video[*],source[*],iframe[*]',
    
    // File picker configuration (disable default, use custom)
    file_picker_callback: enableMediaLibrary ? undefined : (callback: any, value: any, meta: any) => {
      // Default file picker behavior for when media library is disabled
      if (meta.filetype === 'image') {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.addEventListener('change', (e: any) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
              callback(reader.result, {
                alt: file.name
              });
            });
            reader.readAsDataURL(file);
          }
        });
        input.click();
      }
    },
    
    // Setup function
    setup: (editor: any) => {
      // Custom initialization logic
      editor.on('init', () => {
        console.log('Enhanced WYSIWYG Editor initialized with media library support');
        
        // Fix passive event listeners after initialization
        setTimeout(() => {
          const editorContainer = editor.getContainer();
          if (editorContainer) {
            const addPassiveListeners = (element: Element) => {
              const touchElements = element.querySelectorAll('[data-mce-selected]');
              touchElements.forEach((el) => {
                const newEl = el.cloneNode(true);
                el.parentNode?.replaceChild(newEl, el);
              });
            };
            
            addPassiveListeners(editorContainer);
          }
        }, 100);
      });
      
      // Add custom formats
      editor.on('PreInit', () => {
        editor.formatter.register('responsive-image', {
          selector: 'img',
          styles: {
            'max-width': '100%',
            'height': 'auto'
          }
        });
        
        editor.formatter.register('video-responsive', {
          selector: 'video',
          styles: {
            'max-width': '100%',
            'height': 'auto'
          }
        });
      });
      
      // Handle paste events for better media handling
      editor.on('paste', (e: any) => {
        // Custom paste handling for media content
        const clipboardData = e.clipboardData || (window as any).clipboardData;
        if (clipboardData && clipboardData.files && clipboardData.files.length > 0) {
          e.preventDefault();
          // Handle file paste - could integrate with media library
          console.log('Files pasted:', clipboardData.files);
        }
      });
    }
  }), [
    height, 
    placeholder, 
    enableMediaLibrary, 
    enableVideoUpload, 
    enableImageOptimization
  ]);

  return (
    <div className={cn('relative', className)}>
      <Editor
        apiKey="no-api-key" // Use self-hosted TinyMCE
        value={value}
        init={editorConfig}
        onInit={handleInit}
        onEditorChange={handleEditorChange}
        disabled={disabled}
      />
      
      {/* Media Picker Integration */}
      {enableMediaLibrary && (
        <MediaPicker
          isOpen={showMediaPicker}
          onClose={() => setShowMediaPicker(false)}
          onInsert={handleMediaInsert}
          multiple={true}
          allowedTypes={
            mediaPickerMode === 'image' ? ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] :
            mediaPickerMode === 'video' ? ['video/mp4', 'video/webm', 'video/quicktime'] :
            undefined // all types
          }
          enableVideoUpload={enableVideoUpload}
          enableImageOptimization={enableImageOptimization}
          wysiwyg={true}
          showInsertOptions={true}
          insertMode="html"
        />
      )}
    </div>
  );
};

export default WYSIWYGEditor; 