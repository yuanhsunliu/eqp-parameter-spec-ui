import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

interface FormData {
  tool_name: string;
  parameter_name: string;
  lsl: string;
  lcl: string;
  cl: string;
  ucl: string;
  usl: string;
}

interface FormErrors {
  tool_name?: string;
  parameter_name?: string;
  lsl?: string;
  lcl?: string;
  cl?: string;
  ucl?: string;
  usl?: string;
  relationship?: string;
}

const API_BASE_URL = "http://127.0.0.1:5001";

export function ParameterSpecForm() {
  const [formData, setFormData] = useState<FormData>({
    tool_name: "",
    parameter_name: "",
    lsl: "",
    lcl: "",
    cl: "",
    ucl: "",
    usl: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (errors.relationship) {
      setErrors((prev) => ({ ...prev, relationship: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required field validation
    if (!formData.tool_name.trim()) {
      newErrors.tool_name = "機台名稱為必填欄位";
    } else if (formData.tool_name.length > 100) {
      newErrors.tool_name = "機台名稱不可超過 100 字元";
    }

    if (!formData.parameter_name.trim()) {
      newErrors.parameter_name = "參數名稱為必填欄位";
    } else if (formData.parameter_name.length > 100) {
      newErrors.parameter_name = "參數名稱不可超過 100 字元";
    }

    // Numeric field validation
    const numericFields: (keyof FormData)[] = ["lsl", "lcl", "cl", "ucl", "usl"];
    const fieldLabels: Record<string, string> = {
      lsl: "LSL",
      lcl: "LCL",
      cl: "CL",
      ucl: "UCL",
      usl: "USL",
    };

    const numericValues: Record<string, number> = {};

    for (const field of numericFields) {
      if (!formData[field].trim()) {
        newErrors[field] = `${fieldLabels[field]} 為必填欄位`;
      } else if (isNaN(Number(formData[field]))) {
        newErrors[field] = `${fieldLabels[field]} 必須為數字`;
      } else {
        numericValues[field] = Number(formData[field]);
      }
    }

    // Value relationship validation: LSL < LCL < CL < UCL < USL
    if (Object.keys(numericValues).length === 5) {
      const { lsl, lcl, cl, ucl, usl } = numericValues;
      if (!(lsl < lcl && lcl < cl && cl < ucl && ucl < usl)) {
        newErrors.relationship =
          "數值關係錯誤：必須符合 LSL < LCL < CL < UCL < USL";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/parameter-specs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tool_name: formData.tool_name.trim(),
          parameter_name: formData.parameter_name.trim(),
          lsl: Number(formData.lsl),
          lcl: Number(formData.lcl),
          cl: Number(formData.cl),
          ucl: Number(formData.ucl),
          usl: Number(formData.usl),
        }),
      });

      if (response.status === 201) {
        toast.success("參數規格新增成功！");
      } else if (response.status === 409) {
        toast.error("此機台參數規格已存在，請確認機台名稱與參數名稱");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "新增失敗，請稍後再試");
      }
    } catch {
      toast.error("連線失敗，請確認 API 服務是否正常運作");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-[300px] shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg text-center">機台參數規格</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="tool_name">機台名稱 (Tool Name)</Label>
            <Input
              id="tool_name"
              data-testid="tool_name"
              value={formData.tool_name}
              onChange={(e) => handleInputChange("tool_name", e.target.value)}
              placeholder="例如：ETCHER_01"
              className={errors.tool_name ? "border-red-500" : ""}
            />
            {errors.tool_name && (
              <p className="text-xs text-red-500">{errors.tool_name}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="parameter_name">參數名稱 (Parameter Name)</Label>
            <Input
              id="parameter_name"
              data-testid="parameter_name"
              value={formData.parameter_name}
              onChange={(e) =>
                handleInputChange("parameter_name", e.target.value)
              }
              placeholder="例如：pressure"
              className={errors.parameter_name ? "border-red-500" : ""}
            />
            {errors.parameter_name && (
              <p className="text-xs text-red-500">{errors.parameter_name}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="lsl">下規格界線 (LSL)</Label>
            <Input
              id="lsl"
              data-testid="lsl"
              type="number"
              step="any"
              value={formData.lsl}
              onChange={(e) => handleInputChange("lsl", e.target.value)}
              placeholder="例如：50"
              className={errors.lsl ? "border-red-500" : ""}
            />
            {errors.lsl && (
              <p className="text-xs text-red-500">{errors.lsl}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="lcl">下管制界線 (LCL)</Label>
            <Input
              id="lcl"
              data-testid="lcl"
              type="number"
              step="any"
              value={formData.lcl}
              onChange={(e) => handleInputChange("lcl", e.target.value)}
              placeholder="例如：60"
              className={errors.lcl ? "border-red-500" : ""}
            />
            {errors.lcl && (
              <p className="text-xs text-red-500">{errors.lcl}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="cl">中心線 (CL)</Label>
            <Input
              id="cl"
              data-testid="cl"
              type="number"
              step="any"
              value={formData.cl}
              onChange={(e) => handleInputChange("cl", e.target.value)}
              placeholder="例如：100"
              className={errors.cl ? "border-red-500" : ""}
            />
            {errors.cl && <p className="text-xs text-red-500">{errors.cl}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="ucl">上管制界線 (UCL)</Label>
            <Input
              id="ucl"
              data-testid="ucl"
              type="number"
              step="any"
              value={formData.ucl}
              onChange={(e) => handleInputChange("ucl", e.target.value)}
              placeholder="例如：140"
              className={errors.ucl ? "border-red-500" : ""}
            />
            {errors.ucl && (
              <p className="text-xs text-red-500">{errors.ucl}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="usl">上規格界線 (USL)</Label>
            <Input
              id="usl"
              data-testid="usl"
              type="number"
              step="any"
              value={formData.usl}
              onChange={(e) => handleInputChange("usl", e.target.value)}
              placeholder="例如：150"
              className={errors.usl ? "border-red-500" : ""}
            />
            {errors.usl && (
              <p className="text-xs text-red-500">{errors.usl}</p>
            )}
          </div>

          {errors.relationship && (
            <p className="text-xs text-red-500 text-center" data-testid="relationship-error">
              {errors.relationship}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
            data-testid="submit-button"
          >
            {isSubmitting ? "送出中..." : "送出"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
