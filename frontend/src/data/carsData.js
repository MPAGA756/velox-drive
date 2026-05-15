/* ══════════════════════════════════════════════════════════
   Données statiques de fallback — utilisées si l'API
   n'est pas joignable (mode démo / frontend seul)
   ══════════════════════════════════════════════════════════ */
const STATIC_CARS = [
  { id:1,  name:'PAJERO SPORT',              brand:'Mitsubishi',   category:'SUV Sport', price:580000, transmission:'Automatique', fuel:'Essence',    seats:7, image_url:'https://www.mitsubishi-motors.ci/media/gamme/modeles/images/a91baec278b6ff3242b6314fcc755ee1.png', badge:'Exclusif'  },
  { id:2,  name:'Lamborghini Huracán',       brand:'Lamborghini',  category:'Sport',     price:790000, transmission:'Automatique', fuel:'Essence',    seats:2, image_url:'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80', badge:'Top'       },
  { id:3,  name:'Porsche 911 GT3',           brand:'Porsche',      category:'Sport',     price:425000, transmission:'Manuelle',    fuel:'Essence',    seats:2, image_url:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80', badge:'Populaire' },
  { id:4,  name:'Rolls-Royce Ghost',         brand:'Rolls-Royce',  category:'Luxe',      price:640000, transmission:'Automatique', fuel:'Essence',    seats:5, image_url:'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=800&q=80', badge:'Prestige'  },
  { id:5,  name:'Bentley Continental GT',    brand:'Bentley',      category:'Luxe',      price:555000, transmission:'Automatique', fuel:'Essence',    seats:4, image_url:'https://images.unsplash.com/photo-1563137397-04f0311f8e4a?w=800&q=80', badge:null        },
  { id:6,  name:'McLaren 720S',              brand:'McLaren',      category:'Sport',     price:685000, transmission:'Automatique', fuel:'Essence',    seats:2, image_url:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', badge:'Nouveau'   },
  { id:7,  name:'Mercedes-AMG GT',           brand:'Mercedes',     category:'Sport',     price:360000, transmission:'Automatique', fuel:'Essence',    seats:2, image_url:'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80', badge:null        },
  { id:8,  name:'Tesla Model S Plaid',       brand:'Tesla',        category:'Électrique',price:210000, transmission:'Automatique', fuel:'Électrique', seats:5, image_url:'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80', badge:'Éco'       },
  { id:9,  name:'BMW M8 Competition',        brand:'BMW',          category:'Sport',     price:315000, transmission:'Automatique', fuel:'Essence',    seats:4, image_url:'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80', badge:null        },
  { id:10, name:'Aston Martin DB11',         brand:'Aston Martin', category:'Luxe',      price:515000, transmission:'Automatique', fuel:'Essence',    seats:4, image_url:'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80', badge:null        },
  { id:11, name:'Range Rover Autobiography', brand:'Land Rover',   category:'SUV',       price:275000, transmission:'Automatique', fuel:'Hybride',    seats:5, image_url:'https://images.unsplash.com/photo-1566473965997-3de9c817e938?w=800&q=80', badge:'Confort'   },
  { id:12, name:'Porsche Cayenne Turbo',     brand:'Porsche',      category:'SUV',       price:255000, transmission:'Automatique', fuel:'Essence',    seats:5, image_url:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80', badge:null        },
]

export default STATIC_CARS