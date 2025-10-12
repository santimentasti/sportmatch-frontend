/**
 * Motivational Texts - SportMatch Brand Voice
 * Todos los textos con impronta argentina y tono motivacional
 * para reforzar el crecimiento personal y deportivo
 * 🇦🇷 Adaptado para la comunidad argentina
 */

export const MOTIVATIONAL_TEXTS = {
  // Auth & Onboarding
  auth: {
    welcomeTitle: '¡Bienvenido a SportMatch!',
    welcomeSubtitle: 'Tu próxima gran victoria empieza con una buena conexión',
    loginButton: '¡Dale, a Jugar!',
    registerButton: '¡Arrancamos!',
    loginSuccess: '¡Qué bueno verte de vuelta! La banda te estaba esperando',
    registerSuccess: '¡Genial! Tu historia deportiva arranca ahora',
    logoutSuccess: '¡Nos vemos! Seguí entrenando fuerte',
  },

  // Home Page
  home: {
    heroTitle: 'Cada día es una',
    heroHighlight: 'oportunidad',
    heroSubtitle: 'Superáte, conectá con tu comunidad y viví el deporte como nunca. Tu mejor versión te está esperando.',
    features: {
      community: {
        title: 'Crecé con tu Comunidad',
        description: 'Encontrá compañeros que te empujan a ser mejor cada día'
      },
      location: {
        title: 'Oportunidades Cerca Tuyo',
        description: 'Tu próximo desafío está a la vuelta de la esquina'
      },
      matching: {
        title: 'Conexiones Perfectas',
        description: 'Encontrá tu match deportivo ideal al toque'
      },
      diversity: {
        title: 'Sin Límites',
        description: 'Desafiate en cualquier deporte, expandí tus horizontes'
      }
    },
    cta: 'Ver Todos los Deportes'
  },

  // Sport Profile
  sportProfile: {
    title: '¿Cuál es tu Próximo Desafío?',
    subtitle: 'Elegí tus deportes y mostrá de qué estás hecho. Cada elección es un paso hacia tu mejor versión.',
    selectSport: 'Seleccioná tus Deportes',
    selectLevel: 'Definí tu Nivel',
    levelDescriptions: {
      beginner: 'Todo crack arrancó acá',
      intermediate: 'Vas por buen camino',
      advanced: 'Tu dedicación te hace destacar',
      expert: 'Sos un ejemplo para otros'
    },
    locationTitle: 'Tu Cancha',
    locationSubtitle: 'Marcá tu zona y encontrá desafíos cerca tuyo',
    getLocationButton: '📍 Obtener Mi Ubicación',
    saveButton: 'Guardar y Continuar',
    saveSuccess: '¡Perfecto! Tu perfil está listo para la acción',
    continueButton: '¡Dale!'
  },

  // Matching
  matching: {
    title: 'Tu Próximo Compañero te Espera',
    subtitle: 'Conectá con jugadores que te van a desafiar a superarte',
    noPlayers: {
      title: 'El Match Perfecto Va a Llegar',
      subtitle: 'Por ahora, seguí entrenando. Grandes cosas están por venir',
      button: 'Explorar Otros Deportes'
    },
    noMore: {
      title: '¡Diste el 100%!',
      subtitle: 'Volvé pronto para más desafíos. Mientras tanto, entrená duro',
      button: 'Buscar Otro Desafío'
    },
    matchFound: {
      title: '¡Match Perfecto!',
      message: 'Conectaron. Ahora es momento de brillar juntos',
      chatButton: 'Iniciar Conversación',
      continueButton: 'Seguir Buscando'
    }
  },

  // Chat
  chat: {
    title: 'Tus Conexiones',
    subtitle: 'Coordiná, motivá y crecé junto a tu comunidad',
    noConversations: {
      title: 'Tu Equipo te Espera',
      subtitle: 'Hacé match y empezá a armar tu red deportiva',
      button: 'Buscar Jugadores'
    },
    searchPlaceholder: 'Buscar conversaciones...',
    typePlaceholder: 'Escribí tu mensaje...',
    sendButton: 'Enviar'
  },

  // Matches List
  matches: {
    title: 'Tus Victorias',
    subtitle: 'Cada match es un paso hacia la grandeza',
    noMatches: {
      title: 'Tu Primera Victoria Está Cerca',
      subtitle: 'Salí y conquistá. Los grandes logros arrancan con una acción',
      button: 'Empezar a Buscar'
    },
    viewChat: 'Conversar',
    viewDetails: 'Ver Detalles',
    statusPending: 'Por Confirmar',
    statusConfirmed: 'Confirmado',
    statusCompleted: 'Completado',
    statusCancelled: 'Cancelado'
  },

  // Notifications
  notifications: {
    title: 'Mantenéte Alerta',
    subtitle: 'No te pierdas ninguna oportunidad de brillar',
    markAllRead: 'Marcar Todo como Leído',
    noNotifications: {
      title: 'Todo Bajo Control',
      subtitle: 'Mientras tanto, seguí superándote cada día',
      button: 'Explorar'
    }
  },

  // Profile
  profile: {
    title: 'Mi Perfil',
    subtitle: 'Gestioná tu información personal y preferencias',
    statsTitle: 'Tus Estadísticas y Logros',
    statsSubtitle: 'Cada número cuenta tu historia de superación',
    editButton: 'Editar Perfil',
    saveButton: 'Guardar Cambios',
    cancelButton: 'Cancelar',
    updateSuccess: '¡Actualizado! Seguís mejorando',
    sections: {
      location: 'Ubicación',
      updateLocation: 'Actualizar',
      locationSuccess: 'Ubicación actualizada. Listo para nuevos desafíos',
      maxDistance: 'Distancia máxima de búsqueda',
      settings: 'Configuración',
      notifications: {
        title: 'Notificaciones',
        subtitle: 'No te pierdas ningún desafío'
      },
      privacy: {
        title: 'Privacidad',
        subtitle: 'Controlá tu visibilidad'
      }
    }
  },

  // Enhanced Profile
  profileStats: {
    memberSince: 'Miembro desde',
    quickLinks: 'Accesos Rápidos',
    viewMatches: 'Ver Mis Victorias',
    findPlayers: 'Buscar Nuevos Desafíos',
    myConversations: 'Mis Conversaciones',
    mySports: 'Mis Deportes',
    achievementsTitle: 'Logros Desbloqueados',
    statistics: {
      totalMatches: 'Total de Matches',
      completed: 'Completados',
      averageRating: 'Calificación Promedio',
      pending: 'Pendientes'
    }
  },

  // Venues
  venues: {
    title: 'Canchas y Clubes',
    subtitle: 'Encontrá el lugar perfecto para tu próximo desafío',
    searchPlaceholder: 'Buscar canchas...',
    filterAll: 'Todos los Deportes',
    noVenues: {
      title: 'Explorando Nuevos Territorios',
      subtitle: 'Pronto va a haber más lugares para conquistar',
      button: 'Volver'
    },
    distance: 'km de distancia',
    viewDetails: 'Ver Detalles'
  },

  // Sport Selection
  sports: {
    title: 'Elegí tu Cancha',
    subtitle: 'Cada deporte es una oportunidad para superarte',
    searchPlaceholder: 'Buscar deportes...',
    teamSport: 'Equipo',
    individualSport: 'Individual',
    players: 'jugadores',
    selectButton: '¡A Jugar!',
    noResults: {
      title: 'Seguí Explorando',
      subtitle: 'El deporte perfecto para vos está acá',
      button: 'Limpiar Búsqueda'
    }
  },

  // General UI
  general: {
    loading: 'Cargando...',
    error: 'Algo salió mal. Pero los campeones no se rinden',
    retry: 'Intentar de Nuevo',
    cancel: 'Cancelar',
    save: 'Guardar',
    delete: 'Eliminar',
    edit: 'Editar',
    back: 'Volver',
    next: 'Siguiente',
    finish: 'Finalizar',
    close: 'Cerrar',
    confirm: 'Confirmar',
    search: 'Buscar',
    filter: 'Filtrar',
    sort: 'Ordenar',
    noData: 'No hay datos disponibles',
    comingSoon: 'Próximamente',
    underConstruction: 'En construcción. Grandes cosas están por venir'
  },

  // Error Messages
  errors: {
    network: 'Revisá tu conexión. Los campeones siempre encuentran la forma',
    auth: 'Credenciales incorrectas. Intentalo de nuevo',
    notFound: 'No encontramos lo que buscás. Seguí explorando',
    serverError: 'Error del servidor. Volvé pronto, vamos a estar mejor',
    validation: 'Verificá tus datos. La precisión es clave',
    generic: 'Algo salió mal. Pero vos sos más fuerte que esto'
  }
}

export default MOTIVATIONAL_TEXTS

