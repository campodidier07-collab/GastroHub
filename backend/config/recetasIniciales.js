const RECETAS_INICIALES = [
    {
        _id: '6726a1000000000000000001',
        titulo: 'Risotto Cremoso de Hongos Silvestres y Trufa',
        descripcion: 'Arroz arbóreo cocinado lentamente en caldo de vegetales tostados, terminado con mantequilla avellana, parmesano reggiano de 24 meses y aceite de trufa negra.',
        categoria: 'Plato Fuerte',
        dificultad: 'Media',
        tiempo: '40 minutos',
        porciones: 4,
        calorias: 520,
        imagenUrl: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=900&q=80',
        favorito: true,
        ingredientes: [
            { nombre: 'Arroz Arbóreo', cantidad: 350, unidad: 'gr' },
            { nombre: 'Hongos Portobello y Shiitake', cantidad: 300, unidad: 'gr' },
            { nombre: 'Caldo de vegetales caliente', cantidad: 1200, unidad: 'ml' },
            { nombre: 'Vino blanco seco', cantidad: 120, unidad: 'ml' },
            { nombre: 'Queso Parmesano Reggiano rallado', cantidad: 80, unidad: 'gr' },
            { nombre: 'Mantequilla sin sal fría', cantidad: 50, unidad: 'gr' },
            { nombre: 'Chalota finamente picada', cantidad: 2, unidad: 'unidades' }
        ],
        pasos: [
            'Saltear los hongos laminados en una sartén amplia con aceite de oliva a fuego alto hasta dorar. Reservar con sus jugos.',
            'En una olla de fondo grueso, sofreír la chalota en la mitad de la mantequilla durante 3 minutos sin que tome color oscuro.',
            'Incorporar el arroz arbóreo y nacarar durante 2 minutos removiendo constantemente hasta que los bordes se vean translúcidos.',
            'Desglasar con el vino blanco seco y cocinar hasta que el alcohol se evapore por completo.',
            'Agregar el caldo caliente cucharón a cucharón, removiendo suavemente para liberar el almidón antes de añadir el siguiente.',
            'A los 16 minutos de cocción, reincorporar los hongos salteados. Retirar del fuego y mantecar con la mantequilla fría y el parmesano.'
        ],
        createdAt: '2026-10-28T14:20:00.000Z',
        updatedAt: '2026-10-28T14:20:00.000Z'
    },
    {
        _id: '6726a1000000000000000002',
        titulo: 'Ceviche Peruano Clásico con Leche de Tigre al Ají Limo',
        descripcion: 'Cubos frescos de corvina blanca marinados al instante en limón sutil, cilantro fresco, cebolla morada en pluma y emulsión cítrica de leche de tigre.',
        categoria: 'Entrada',
        dificultad: 'Fácil',
        tiempo: '25 minutos',
        porciones: 4,
        calorias: 290,
        imagenUrl: 'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?auto=format&fit=crop&w=900&q=80',
        favorito: true,
        ingredientes: [
            { nombre: 'Filete de corvina fresca', cantidad: 600, unidad: 'gr' },
            { nombre: 'Jugo de limón sutil recién exprimido', cantidad: 180, unidad: 'ml' },
            { nombre: 'Cebolla morada en pluma fina', cantidad: 1, unidad: 'unidad' },
            { nombre: 'Ají limo rojo sin semillas', cantidad: 1, unidad: 'unidad' },
            { nombre: 'Cilantro fresco picado', cantidad: 25, unidad: 'gr' },
            { nombre: 'Camote glaseado cocido', cantidad: 200, unidad: 'gr' },
            { nombre: 'Maíz cancha tostado', cantidad: 80, unidad: 'gr' }
        ],
        pasos: [
            'Cortar la corvina fría en dados regulares de 2 cm y mantener en un bol de acero refrigerado.',
            'Sazonar el pescado con sal marina y frotar suavemente con medio ají limo para perfumar sin picar en exceso.',
            'Verter el jugo de limón recién exprimido junto con un cubo de hielo para mantener la temperatura baja.',
            'Añadir la cebolla morada lavada y escurrida junto con el cilantro fresco recién picado; mezclar durante 30 segundos.',
            'Servir de inmediato acompañado de rodajas de camote glaseado y maíz cancha crocante.'
        ],
        createdAt: '2026-10-29T18:10:00.000Z',
        updatedAt: '2026-10-29T18:10:00.000Z'
    },
    {
        _id: '6726a1000000000000000003',
        titulo: 'Salmón Noruego en Costra de Pistachos y Miel de Mostaza',
        descripcion: 'Lomos de salmón horneados a punto jugoso con cubierta crujiente de pistachos tostados, hierbas mediterráneas y reducción cítrica de mostaza Dijon.',
        categoria: 'Plato Fuerte',
        dificultad: 'Fácil',
        tiempo: '30 minutos',
        porciones: 2,
        calorias: 480,
        imagenUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=80',
        favorito: false,
        ingredientes: [
            { nombre: 'Lomos de salmón fresco con piel', cantidad: 450, unidad: 'gr' },
            { nombre: 'Pistachos pelados y picados', cantidad: 70, unidad: 'gr' },
            { nombre: 'Mostaza Dijon antigua', cantidad: 30, unidad: 'gr' },
            { nombre: 'Miel de abejas pura', cantidad: 25, unidad: 'ml' },
            { nombre: 'Ralladura de limón amarillo', cantidad: 1, unidad: 'unidad' },
            { nombre: 'Aceite de oliva virgen extra', cantidad: 20, unidad: 'ml' }
        ],
        pasos: [
            'Precalentar el horno a 200 °C y secar perfectamente los lomos de salmón con papel absorbente.',
            'Mezclar en un recipiente la mostaza Dijon, la miel y la ralladura de limón hasta obtener un glaseado homogéneo.',
            'Pincelar la parte superior de cada lomo con el glaseado y presionar los pistachos picados para formar una costra uniforme.',
            'Hornear durante 12 a 14 minutos hasta que los pistachos estén dorados y el centro del salmón conserve jugosidad.'
        ],
        createdAt: '2026-10-30T11:45:00.000Z',
        updatedAt: '2026-10-30T11:45:00.000Z'
    },
    {
        _id: '6726a1000000000000000004',
        titulo: 'Volcán Coulant de Chocolate Belga 70% con Frutos Rojos',
        descripcion: 'Bizcocho tibio de cacao intenso con centro líquido fundente, acompañado de reducción de frambuesas frescas y azúcar pulverizada.',
        categoria: 'Postre',
        dificultad: 'Alta',
        tiempo: '35 minutos',
        porciones: 4,
        calorias: 410,
        imagenUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80',
        favorito: true,
        ingredientes: [
            { nombre: 'Chocolate negro 70% cacao', cantidad: 180, unidad: 'gr' },
            { nombre: 'Mantequilla sin sal', cantidad: 120, unidad: 'gr' },
            { nombre: 'Huevos camperos enteros', cantidad: 3, unidad: 'unidades' },
            { nombre: 'Yemas de huevo adicionales', cantidad: 2, unidad: 'unidades' },
            { nombre: 'Azúcar blanca fina', cantidad: 75, unidad: 'gr' },
            { nombre: 'Harina de trigo tamizada', cantidad: 45, unidad: 'gr' }
        ],
        pasos: [
            'Engrasar 4 moldes individuales tipo ramekin con mantequilla y espolvorear con cacao puro en polvo.',
            'Fundir el chocolate negro junto con la mantequilla a baño María suave hasta lograr una mezcla brillante.',
            'Batir los huevos, las yemas y el azúcar a punto cinta hasta que tripliquen su volumen.',
            'Integrar el chocolate tibio con movimientos envolventes y añadir la harina tamizada sin sobrebatir.',
            'Hornear a 210 °C exactamente durante 10 minutos; dejar reposar 1 minuto antes de desmoldar y servir caliente.'
        ],
        createdAt: '2026-10-31T16:00:00.000Z',
        updatedAt: '2026-10-31T16:00:00.000Z'
    },
    {
        _id: '6726a1000000000000000005',
        titulo: 'Bowl Mediterráneo de Quinoa Tricolor y Pollo al Limón',
        descripcion: 'Combinación nutritiva de quinoa orgánica, pechuga grillada a las finas hierbas, aguacate hass, garbanzos especiados al pimentón y aderezo tahini.',
        categoria: 'Ensalada',
        dificultad: 'Fácil',
        tiempo: '25 minutos',
        porciones: 2,
        calorias: 440,
        imagenUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80',
        favorito: false,
        ingredientes: [
            { nombre: 'Quinoa tricolor cocida', cantidad: 220, unidad: 'gr' },
            { nombre: 'Pechuga de pollo orgánica', cantidad: 300, unidad: 'gr' },
            { nombre: 'Aguacate Hass maduro', cantidad: 1, unidad: 'unidad' },
            { nombre: 'Garbanzos cocidos y tostados', cantidad: 120, unidad: 'gr' },
            { nombre: 'Tomates cherry en mitades', cantidad: 100, unidad: 'gr' },
            { nombre: 'Salsa tahini con limón', cantidad: 45, unidad: 'ml' }
        ],
        pasos: [
            'Lavar la quinoa bajo agua fría y cocer durante 14 minutos en el doble de agua con una pizca de sal.',
            'Marinar la pechuga con orégano, ajo, jugo de limón y aceite de oliva; dorar en plancha caliente 4 minutos por lado.',
            'Saltear los garbanzos con pimentón ahumado y comino hasta que queden crujientes.',
            'Disponer en un bol la base de quinoa tibia, láminas de pollo, aguacate, tomates cherry y aderezar con tahini.'
        ],
        createdAt: '2026-11-01T09:30:00.000Z',
        updatedAt: '2026-11-01T09:30:00.000Z'
    },
    {
        _id: '6726a1000000000000000006',
        titulo: 'Ramen Tonkotsu Artesanal con Chashu Glaseado y Ajitsuke Tamago',
        descripcion: 'Caldo sedoso de cocción lenta con fideos alcalinos frescos, panceta braseada en salsa tare de soya y mirin, huevo marinado y aceite de ajo negro.',
        categoria: 'Sopa',
        dificultad: 'Alta',
        tiempo: '90 minutos',
        porciones: 4,
        calorias: 630,
        imagenUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80',
        favorito: true,
        ingredientes: [
            { nombre: 'Fideos frescos para ramen', cantidad: 500, unidad: 'gr' },
            { nombre: 'Caldo concentrado de cerdo y dashi', cantidad: 1500, unidad: 'ml' },
            { nombre: 'Panceta de cerdo braseada (Chashu)', cantidad: 320, unidad: 'gr' },
            { nombre: 'Huevos marinados en soya y mirin', cantidad: 4, unidad: 'unidades' },
            { nombre: 'Cebollín japonés picado', cantidad: 40, unidad: 'gr' },
            { nombre: 'Alga nori tostada', cantidad: 4, unidad: 'hojas' }
        ],
        pasos: [
            'Calentar el caldo concentrado a fuego lento e infusionar con jengibre fresco y ajo tostado durante 20 minutos.',
            'Sellar las rodajas de panceta Chashu con soplete o sartén de hierro hasta caramelizar el glaseado de soya y mirin.',
            'Cocinar los fideos en abundante agua hirviendo durante 90 segundos exactos y escurrir vigorosamente.',
            'Servir el tare en el fondo de cada tazón, verter el caldo hirviendo, acomodar los fideos y coronar con Chashu, huevo en mitades y nori.'
        ],
        createdAt: '2026-11-01T19:15:00.000Z',
        updatedAt: '2026-11-01T19:15:00.000Z'
    }
];

module.exports = { RECETAS_INICIALES };
