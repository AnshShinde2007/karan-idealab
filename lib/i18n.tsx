"use client"

import * as React from "react"

export const languages = {
  en: "English",
  es: "Espanol",
  fr: "Francais",
  hi: "Hindi",
  zh: "Chinese",
  ar: "Arabic",
} as const

export type LanguageCode = keyof typeof languages

export const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    "hero.title": "Emergency Rescue Network Powered by HAPS",
    "hero.subtitle": "Stay Connected. Stay Safe. Get Help Fast.",
    "hero.request_help": "Request Help",
    "hero.find_camps": "Find Rescue Camps",
    "hero.live_alerts": "Live Alerts",
    "nav.home": "Home",
    "nav.features": "Features",
    "nav.request_help": "Request Help",
    "nav.camps": "Find Camps",
    "nav.alerts": "Alerts",
    "nav.about": "About HAPS",
    "nav.dashboard": "Dashboard",
    "form.title": "Request Emergency Help",
    "form.name": "Full Name",
    "form.phone": "Phone Number",
    "form.location": "Current Location",
    "form.auto_detect": "Auto Detect",
    "form.disaster_type": "Disaster Type",
    "form.people_count": "Number of People",
    "form.description": "Describe Your Situation",
    "form.urgency": "Urgency Level",
    "form.upload_photo": "Upload Photo (Optional)",
    "form.submit": "Submit SOS Request",
    "form.voice_message": "Voice Message",
    "camps.title": "Find Nearby Rescue Camps",
    "camps.list_view": "List View",
    "camps.map_view": "Map View",
    "camps.search": "Search camps...",
    "camps.get_directions": "Get Directions",
    "alerts.title": "Live Disaster Alerts",
    "alerts.active": "Active",
    "alerts.enable_notifications": "Enable Push Notifications",
    "chat.title": "SkyRelief Assistant",
    "chat.placeholder": "Type your message...",
    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "common.success": "Success",
    "common.cancel": "Cancel",
    "common.close": "Close",
    "common.submit": "Submit",
    "common.save": "Save",
  },
  es: {
    "hero.title": "Red de Rescate de Emergencia con HAPS",
    "hero.subtitle": "Mantente Conectado. Mantente Seguro. Obtén Ayuda Rapido.",
    "hero.request_help": "Solicitar Ayuda",
    "hero.find_camps": "Buscar Campamentos",
    "hero.live_alerts": "Alertas en Vivo",
    "nav.home": "Inicio",
    "nav.features": "Caracteristicas",
    "nav.request_help": "Solicitar Ayuda",
    "nav.camps": "Campamentos",
    "nav.alerts": "Alertas",
    "nav.about": "Sobre HAPS",
    "nav.dashboard": "Panel",
    "form.title": "Solicitar Ayuda de Emergencia",
    "form.name": "Nombre Completo",
    "form.phone": "Numero de Telefono",
    "form.location": "Ubicacion Actual",
    "form.auto_detect": "Detectar Auto",
    "form.disaster_type": "Tipo de Desastre",
    "form.people_count": "Numero de Personas",
    "form.description": "Describe Tu Situacion",
    "form.urgency": "Nivel de Urgencia",
    "form.upload_photo": "Subir Foto (Opcional)",
    "form.submit": "Enviar Solicitud SOS",
    "form.voice_message": "Mensaje de Voz",
    "camps.title": "Encontrar Campamentos Cercanos",
    "camps.list_view": "Vista de Lista",
    "camps.map_view": "Vista de Mapa",
    "camps.search": "Buscar campamentos...",
    "camps.get_directions": "Obtener Direcciones",
    "alerts.title": "Alertas de Desastres en Vivo",
    "alerts.active": "Activo",
    "alerts.enable_notifications": "Habilitar Notificaciones",
    "chat.title": "Asistente SkyRelief",
    "chat.placeholder": "Escribe tu mensaje...",
    "common.loading": "Cargando...",
    "common.error": "Ocurrio un error",
    "common.success": "Exito",
    "common.cancel": "Cancelar",
    "common.close": "Cerrar",
    "common.submit": "Enviar",
    "common.save": "Guardar",
  },
  fr: {
    "hero.title": "Reseau de Secours d'Urgence avec HAPS",
    "hero.subtitle": "Restez Connecte. Restez en Securite. Obtenez de l'Aide Rapidement.",
    "hero.request_help": "Demander de l'Aide",
    "hero.find_camps": "Trouver des Camps",
    "hero.live_alerts": "Alertes en Direct",
    "nav.home": "Accueil",
    "nav.features": "Fonctionnalites",
    "nav.request_help": "Demander de l'Aide",
    "nav.camps": "Camps",
    "nav.alerts": "Alertes",
    "nav.about": "A propos de HAPS",
    "nav.dashboard": "Tableau de Bord",
    "form.title": "Demander une Aide d'Urgence",
    "form.name": "Nom Complet",
    "form.phone": "Numero de Telephone",
    "form.location": "Position Actuelle",
    "form.auto_detect": "Detection Auto",
    "form.disaster_type": "Type de Catastrophe",
    "form.people_count": "Nombre de Personnes",
    "form.description": "Decrivez Votre Situation",
    "form.urgency": "Niveau d'Urgence",
    "form.upload_photo": "Telecharger une Photo (Optionnel)",
    "form.submit": "Soumettre la Demande SOS",
    "form.voice_message": "Message Vocal",
    "camps.title": "Trouver des Camps de Secours",
    "camps.list_view": "Vue Liste",
    "camps.map_view": "Vue Carte",
    "camps.search": "Rechercher des camps...",
    "camps.get_directions": "Obtenir l'Itineraire",
    "alerts.title": "Alertes Catastrophes en Direct",
    "alerts.active": "Actif",
    "alerts.enable_notifications": "Activer les Notifications",
    "chat.title": "Assistant SkyRelief",
    "chat.placeholder": "Ecrivez votre message...",
    "common.loading": "Chargement...",
    "common.error": "Une erreur est survenue",
    "common.success": "Succes",
    "common.cancel": "Annuler",
    "common.close": "Fermer",
    "common.submit": "Soumettre",
    "common.save": "Enregistrer",
  },
  hi: {
    "hero.title": "HAPS dwara sanchaalit aapatkaaleen bachav network",
    "hero.subtitle": "Jude Rahen. Surakshit Rahen. Jaldi Madad Paayein.",
    "hero.request_help": "Madad Mangein",
    "hero.find_camps": "Bachav Shivir Khojen",
    "hero.live_alerts": "Live Alerts",
    "nav.home": "Home",
    "nav.features": "Visheshataayein",
    "nav.request_help": "Madad Mangein",
    "nav.camps": "Shivir",
    "nav.alerts": "Alerts",
    "nav.about": "HAPS ke baare mein",
    "nav.dashboard": "Dashboard",
    "form.title": "Aapatkaleen Madad Mangein",
    "form.name": "Poora Naam",
    "form.phone": "Phone Number",
    "form.location": "Vartaman Sthiti",
    "form.auto_detect": "Auto Detect",
    "form.disaster_type": "Aapda ka Prakaar",
    "form.people_count": "Logon ki Sankhya",
    "form.description": "Apni Sthiti ka Varnan Karein",
    "form.urgency": "Atyaavashyakta Sthar",
    "form.upload_photo": "Photo Upload Karein (Vaikalpik)",
    "form.submit": "SOS Request Bhejein",
    "form.voice_message": "Voice Message",
    "camps.title": "Nazdeeki Bachav Shivir Khojen",
    "camps.list_view": "List View",
    "camps.map_view": "Map View",
    "camps.search": "Shivir khojen...",
    "camps.get_directions": "Disha Paayein",
    "alerts.title": "Live Aapda Alerts",
    "alerts.active": "Active",
    "alerts.enable_notifications": "Push Notifications Chalayein",
    "chat.title": "SkyRelief Sahayak",
    "chat.placeholder": "Apna message likhein...",
    "common.loading": "Load ho raha hai...",
    "common.error": "Ek error hua",
    "common.success": "Safalta",
    "common.cancel": "Radd Karein",
    "common.close": "Band Karein",
    "common.submit": "Bhejein",
    "common.save": "Save Karein",
  },
  zh: {
    "hero.title": "HAPS Emergency Rescue Network",
    "hero.subtitle": "Stay Connected. Stay Safe. Get Help Fast.",
    "hero.request_help": "Request Help",
    "hero.find_camps": "Find Camps",
    "hero.live_alerts": "Live Alerts",
    "nav.home": "Home",
    "nav.features": "Features",
    "nav.request_help": "Request Help",
    "nav.camps": "Camps",
    "nav.alerts": "Alerts",
    "nav.about": "About HAPS",
    "nav.dashboard": "Dashboard",
    "form.title": "Request Emergency Help",
    "form.name": "Full Name",
    "form.phone": "Phone Number",
    "form.location": "Current Location",
    "form.auto_detect": "Auto Detect",
    "form.disaster_type": "Disaster Type",
    "form.people_count": "Number of People",
    "form.description": "Describe Your Situation",
    "form.urgency": "Urgency Level",
    "form.upload_photo": "Upload Photo",
    "form.submit": "Submit SOS Request",
    "form.voice_message": "Voice Message",
    "camps.title": "Find Nearby Camps",
    "camps.list_view": "List View",
    "camps.map_view": "Map View",
    "camps.search": "Search camps...",
    "camps.get_directions": "Get Directions",
    "alerts.title": "Live Disaster Alerts",
    "alerts.active": "Active",
    "alerts.enable_notifications": "Enable Notifications",
    "chat.title": "SkyRelief Assistant",
    "chat.placeholder": "Type your message...",
    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "common.success": "Success",
    "common.cancel": "Cancel",
    "common.close": "Close",
    "common.submit": "Submit",
    "common.save": "Save",
  },
  ar: {
    "hero.title": "Emergency Rescue Network Powered by HAPS",
    "hero.subtitle": "Stay Connected. Stay Safe. Get Help Fast.",
    "hero.request_help": "Request Help",
    "hero.find_camps": "Find Camps",
    "hero.live_alerts": "Live Alerts",
    "nav.home": "Home",
    "nav.features": "Features",
    "nav.request_help": "Request Help",
    "nav.camps": "Camps",
    "nav.alerts": "Alerts",
    "nav.about": "About HAPS",
    "nav.dashboard": "Dashboard",
    "form.title": "Request Emergency Help",
    "form.name": "Full Name",
    "form.phone": "Phone Number",
    "form.location": "Current Location",
    "form.auto_detect": "Auto Detect",
    "form.disaster_type": "Disaster Type",
    "form.people_count": "Number of People",
    "form.description": "Describe Your Situation",
    "form.urgency": "Urgency Level",
    "form.upload_photo": "Upload Photo",
    "form.submit": "Submit SOS Request",
    "form.voice_message": "Voice Message",
    "camps.title": "Find Nearby Camps",
    "camps.list_view": "List View",
    "camps.map_view": "Map View",
    "camps.search": "Search camps...",
    "camps.get_directions": "Get Directions",
    "alerts.title": "Live Disaster Alerts",
    "alerts.active": "Active",
    "alerts.enable_notifications": "Enable Notifications",
    "chat.title": "SkyRelief Assistant",
    "chat.placeholder": "Type your message...",
    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "common.success": "Success",
    "common.cancel": "Cancel",
    "common.close": "Close",
    "common.submit": "Submit",
    "common.save": "Save",
  },
}

interface LanguageContextType {
  language: LanguageCode
  setLanguage: (lang: LanguageCode) => void
  t: (key: string) => string
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined)

const STORAGE_KEY = "skyrelief_language"

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = React.useState<LanguageCode>("en")

  React.useEffect(() => {
    // Load saved language preference
    const saved = localStorage.getItem(STORAGE_KEY) as LanguageCode | null
    if (saved && saved in languages) {
      setLanguageState(saved)
    }
  }, [])

  const setLanguage = React.useCallback((lang: LanguageCode) => {
    setLanguageState(lang)
    localStorage.setItem(STORAGE_KEY, lang)
  }, [])

  const t = React.useCallback(
    (key: string): string => {
      return translations[language][key] || translations.en[key] || key
    },
    [language]
  )

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = React.useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
