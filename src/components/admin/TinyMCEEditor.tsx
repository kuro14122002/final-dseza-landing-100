import React, { useRef, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { uploadFile } from '@/services/mediaService';
import { toast } from 'sonner';

interface TinyMCEEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
  disabled?: boolean;
  onImageInsert?: (imageUrl: string, altText?: string) => void;
}

const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({
  value,
  onChange,
  placeholder = 'Nhập nội dung bài viết...',
  height = 400,
  disabled = false,
  onImageInsert
}) => {
  const editorRef = useRef<any>(null);

  // Handle image upload
  const handleImageUpload = async (blobInfo: any, progress: (percent: number) => void): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        const file = blobInfo.blob() as File;
        
        // Validate file
        if (!file.type.startsWith('image/')) {
          reject('Chỉ cho phép upload hình ảnh');
          return;
        }
        
        if (file.size > 10 * 1024 * 1024) {
          reject('Hình ảnh không được quá 10MB');
          return;
        }
        
        // Upload file
        const response = await uploadFile(file, 'editor-images', {
          percentage: progress
        });
        
        // Call the callback if provided
        if (onImageInsert) {
          onImageInsert(response.url, file.name);
        }
        
        resolve(response.url);
      } catch (error) {
        console.error('Error uploading image:', error);
        reject('Không thể upload hình ảnh. Vui lòng thử lại.');
      }
    });
  };

  const editorConfig = {
    height,
    menubar: false,
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
      'emoticons', 'codesample', 'quickbars'
    ],
    toolbar: [
      'undo redo | blocks | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify',
      'bullist numlist outdent indent | removeformat | table link image media codesample',
      'fullscreen preview code help'
    ].join(' | '),
    content_style: `
      body { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
        font-size: 14px;
        line-height: 1.6;
        color: #374151;
      }
      h1, h2, h3, h4, h5, h6 {
        color: #111827;
        font-weight: 600;
        margin-top: 1.5em;
        margin-bottom: 0.5em;
      }
      p {
        margin-bottom: 1em;
      }
      img {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }
      blockquote {
        border-left: 4px solid #e5e7eb;
        padding-left: 1em;
        margin: 1.5em 0;
        font-style: italic;
        color: #6b7280;
      }
      pre {
        background-color: #f3f4f6;
        padding: 1em;
        border-radius: 8px;
        overflow-x: auto;
      }
      code {
        background-color: #f3f4f6;
        padding: 0.2em 0.4em;
        border-radius: 4px;
        font-size: 0.9em;
      }
      table {
        border-collapse: collapse;
        width: 100%;
        margin: 1em 0;
      }
      table th, table td {
        border: 1px solid #e5e7eb;
        padding: 0.5em;
        text-align: left;
      }
      table th {
        background-color: #f9fafb;
        font-weight: 600;
      }
    `,
    placeholder,
    branding: false,
    promotion: false,
    statusbar: true,
    elementpath: false,
    resize: 'vertical',
    
    // Image handling
    images_upload_handler: handleImageUpload,
    automatic_uploads: true,
    images_reuse_filename: true,
    images_upload_base_path: '',
    
    // File picker for media
    file_picker_callback: (callback: any, value: any, meta: any) => {
      if (meta.filetype === 'image') {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        
        input.addEventListener('change', async (e: any) => {
          const file = e.target.files[0];
          if (file) {
            try {
              const response = await uploadFile(file, 'editor-images');
              callback(response.url, { alt: file.name });
              
              if (onImageInsert) {
                onImageInsert(response.url, file.name);
              }
            } catch (error) {
              toast.error('Không thể upload hình ảnh');
            }
          }
        });
        
        input.click();
      }
    },
    
    // Media embed
    media_live_embeds: true,
    media_url_resolver: (data: any, resolve: any) => {
      if (data.url.indexOf('youtube.com') !== -1 || data.url.indexOf('youtu.be') !== -1) {
        const videoId = data.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
        if (videoId) {
          resolve({
            html: `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId[1]}" frameborder="0" allowfullscreen></iframe>`
          });
        }
      } else {
        resolve({ html: '' });
      }
    },
    
    // Advanced features
    contextmenu: 'link image table',
    quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
    quickbars_insert_toolbar: 'quickimage quicktable',
    
    // Custom button for media gallery
    setup: (editor: any) => {
      editor.ui.registry.addButton('customimage', {
        text: 'Thư viện',
        icon: 'gallery',
        tooltip: 'Chọn từ thư viện ảnh',
        onAction: () => {
          // This will be handled by the parent component
          if (onImageInsert) {
            // Trigger media gallery modal
            const event = new CustomEvent('openMediaGallery');
            window.dispatchEvent(event);
          }
        }
      });
      
      // Auto-save functionality
      editor.on('input', () => {
        const content = editor.getContent();
        onChange(content);
      });
      
      // Paste handling for images
      editor.on('paste', (e: any) => {
        const items = e.clipboardData?.items;
        if (items) {
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
              const blob = items[i].getAsFile();
              if (blob) {
                e.preventDefault();
                handleImageUpload({ blob: () => blob }, (percent: number) => {
                  console.log(`Upload progress: ${percent}%`);
                }).then((url) => {
                  editor.insertContent(`<img src="${url}" alt="Pasted image" />`);
                }).catch((error) => {
                  toast.error(error);
                });
              }
            }
          }
        }
      });
    },
    
    // Accessibility
    a11y_advanced_options: true,
    
    // Performance
    convert_urls: false,
    relative_urls: false,
    remove_script_host: false,
    
    // Mobile optimization
    mobile: {
      theme: 'silver',
      plugins: ['autosave', 'lists', 'autolink'],
      toolbar: ['undo', 'bold', 'italic', 'styleselect']
    }
  };

  useEffect(() => {
    // Store editor reference for external access
    if (editorRef.current && editorRef.current.editor) {
      window.tinymceEditor = editorRef.current.editor;
    }
  }, []);

  return (
    <div className="tinymce-wrapper">
      <Editor
        ref={editorRef}
        apiKey="no-api-key" // Using self-hosted TinyMCE
        value={value}
        onEditorChange={onChange}
        init={editorConfig}
        disabled={disabled}
      />
      
      <style jsx>{`
        .tinymce-wrapper {
          position: relative;
        }
        
        .tox-tinymce {
          border-radius: 8px !important;
          border: 1px solid #e5e7eb !important;
        }
        
        .tox-toolbar {
          border-bottom: 1px solid #e5e7eb !important;
          background: #f9fafb !important;
        }
        
        .tox-statusbar {
          border-top: 1px solid #e5e7eb !important;
          background: #f9fafb !important;
        }
        
        .tox-edit-area {
          border: none !important;
        }
        
        .tox-toolbar__primary {
          background: transparent !important;
        }
        
        .tox-button {
          color: #374151 !important;
        }
        
        .tox-button:hover {
          background: #e5e7eb !important;
        }
        
        .tox-button--enabled {
          background: #dbeafe !important;
          color: #1d4ed8 !important;
        }
        
        @media (max-width: 768px) {
          .tox-toolbar__group {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
};

export default TinyMCEEditor; 