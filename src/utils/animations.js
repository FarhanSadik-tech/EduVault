export const fadeUp = {
  hidden: {
    opacity: 0,
    y: 30,
  },

  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};



export const fadeIn = {
  hidden:{
    opacity:0
  },

  show:{
    opacity:1,
    transition:{
      duration:0.5
    }
  }
};



export const scaleIn = {
  hidden:{
    opacity:0,
    scale:0.9
  },

  show:{
    opacity:1,
    scale:1,
    transition:{
      duration:0.5
    }
  }
};