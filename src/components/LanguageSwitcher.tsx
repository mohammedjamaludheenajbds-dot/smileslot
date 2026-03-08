import { useLanguageStore } from "@/stores/languageStore";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useLanguageStore();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === "en" ? "ta" : "en")}
      className="gap-1.5 text-xs"
    >
      <Globe className="h-3.5 w-3.5" />
      {t("lang.switch")}
    </Button>
  );
};

export default LanguageSwitcher;
