
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, X, Image, UploadCloud } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ImageUploaderProps {
  initialImageUrl?: string;
  onImageUploaded: (url: string) => void;
  onRemoveImage?: () => void;
}

export default function ImageUploader({ 
  initialImageUrl, 
  onImageUploaded, 
  onRemoveImage 
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(initialImageUrl || "");
  const [mode, setMode] = useState<"upload" | "url">(initialImageUrl ? "url" : "upload");
  const [externalUrl, setExternalUrl] = useState<string>(initialImageUrl || "");
  const [previewError, setPreviewError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      setUploading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Пожалуйста, войдите в систему для загрузки изображений");
      }

      console.log("Загрузка файла...", {
        fileName,
        bucket: 'product-images',
        userId: session.user.id
      });

      // Определяем роли пользователя для логирования
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role, is_super_admin')
        .eq('user_id', session.user.id);
      
      console.log("Роли пользователя:", roles);

      // Make sure we're uploading to the correct bucket
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error("Детали ошибки загрузки:", error);
        throw error;
      }

      if (data) {
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
        
        const uploadedUrl = publicUrlData.publicUrl;
        setImageUrl(uploadedUrl);
        onImageUploaded(uploadedUrl);
        setPreviewError(false);
        
        toast.success("Изображение загружено", {
          description: "Изображение успешно загружено и сохранено"
        });
      }
    } catch (error: any) {
      console.error("Ошибка при загрузке изображения:", error);
      toast.error("Ошибка загрузки изображения", {
        description: error.message || "Произошла ошибка при загрузке файла",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUrlSubmit = () => {
    if (externalUrl.trim()) {
      setImageUrl(externalUrl);
      onImageUploaded(externalUrl);
      toast.success("URL изображения добавлен");
    }
  };

  const handleRemoveImage = () => {
    setImageUrl("");
    setExternalUrl("");
    setPreviewError(false);
    if (onRemoveImage) {
      onRemoveImage();
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <Tabs value={mode} onValueChange={(value) => setMode(value as "upload" | "url")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Загрузить файл</TabsTrigger>
          <TabsTrigger value="url">URL изображения</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="pt-4">
          <div className="flex items-center space-x-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
            <Button 
              onClick={triggerFileInput} 
              disabled={uploading} 
              className="flex-shrink-0"
              variant="outline"
            >
              {uploading ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2">
                    <UploadCloud className="h-4 w-4" />
                  </span>
                  Загрузка...
                </span>
              ) : (
                <span className="flex items-center">
                  <Upload className="mr-2 h-4 w-4" />
                  Выбрать файл
                </span>
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="url" className="pt-4">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="https://example.com/image.jpg"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleUrlSubmit} type="button">
              <Image className="mr-2 h-4 w-4" />
              Применить
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {imageUrl && (
        <div className="relative mt-4 border rounded-md overflow-hidden">
          <img
            src={imageUrl}
            alt="Предпросмотр"
            className="max-h-[200px] object-contain mx-auto"
            onError={() => setPreviewError(true)}
            style={{ display: previewError ? 'none' : 'block' }}
          />
          {previewError && (
            <div className="h-[200px] flex items-center justify-center bg-muted">
              <p className="text-muted-foreground">Ошибка загрузки изображения</p>
            </div>
          )}
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
