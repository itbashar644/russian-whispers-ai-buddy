
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl,
  FormMessage 
} from "@/components/ui/form";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { HelpCircle, Tag } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

// Schema shape for the form data
const generalInfoSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10),
  price: z.number().min(1),
  discountPrice: z.number().optional(),
  category: z.string().min(1),
  inStock: z.boolean(),
  stockQuantity: z.number().int().min(0).optional(),
  countryOfOrigin: z.string(),
  isNew: z.boolean(),
  isBestseller: z.boolean(),
  material: z.string().optional(),
  modelName: z.string().optional(),
  variantName: z.string().optional(),
});

type FormValues = z.infer<typeof generalInfoSchema>;

interface GeneralInfoTabProps {
  form: UseFormReturn<any>;
  categories: string[];
}

const GeneralInfoTab: React.FC<GeneralInfoTabProps> = ({ form, categories }) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Название товара *</FormLabel>
            <FormControl>
              <Input placeholder="Введите название товара" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Описание *</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Введите описание товара"
                className="min-h-[120px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Цена (₽) *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="1000"
                  min="0"
                  step="0.01"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="discountPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Цена со скидкой (₽)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="800"
                  min="0"
                  step="0.01"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? parseFloat(e.target.value) : undefined
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Категория *</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Combined stock status and quantity */}
      <div className="border rounded-md p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FormField
              control={form.control}
              name="inStock"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">В наличии</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {form.watch("inStock") && (
            <FormField
              control={form.control}
              name="stockQuantity"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel className="!mt-0">Количество:</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="w-[100px]"
                        min="0"
                        step="1"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? parseInt(e.target.value)
                              : undefined
                          )
                        }
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      </div>

      {/* Country of origin */}
      <FormField
        control={form.control}
        name="countryOfOrigin"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Страна происхождения *</FormLabel>
            <FormControl>
              <Input placeholder="Россия" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Material */}
      <FormField
        control={form.control}
        name="material"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Материал</FormLabel>
            <FormControl>
              <Input placeholder="Хлопок, пластик, etc." {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Model name for product grouping */}
      <div className="border rounded-md p-4 space-y-4">
        <h3 className="font-medium flex items-center">
          Группировка товаров
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-80">
                <p>Модель используется для объединения вариантов одного товара. Товары с одинаковым названием модели будут отображаться как варианты одного товара.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h3>
        
        <FormField
          control={form.control}
          name="modelName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название модели</FormLabel>
              <FormControl>
                <Input placeholder="Модель XYZ" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="variantName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название варианта</FormLabel>
              <FormControl>
                <Input placeholder="64GB / Красный / XL" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Product flags */}
      <div className="border rounded-md p-4 space-y-4">
        <h3 className="font-medium">Отметки</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="isNew"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="!mt-0">Новинка</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isBestseller"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="!mt-0">Хит продаж</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default GeneralInfoTab;
