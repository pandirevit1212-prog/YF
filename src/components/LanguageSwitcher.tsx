import { useTranslation } from 'react-i18next'
import './LanguageSwitcher.css'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'zh' : 'en'
    i18n.changeLanguage(newLanguage)
  }

  return (
    <button
      className="language-switcher"
      onClick={toggleLanguage}
      title={i18n.language === 'en' ? 'Switch to 中文' : 'Switch to English'}
    >
      {i18n.language === 'en' ? '中文' : 'English'}
    </button>
  )
}
