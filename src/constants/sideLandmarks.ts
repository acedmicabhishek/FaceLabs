export interface LandmarkDefinition {
    id: number;
    name: string;
    image: any;
}

export const SIDE_LANDMARKS: LandmarkDefinition[] = [
    { id: 1, name: 'Vertex', image: require('../../resources/side/1vertex.webp') },
    { id: 2, name: 'Occiput', image: require('../../resources/side/2occiput.webp') },
    { id: 3, name: 'Pronasale', image: require('../../resources/side/3pronasale.webp') },
    { id: 4, name: 'Neck Point', image: require('../../resources/side/4neckPoint.webp') },
    { id: 5, name: 'Porion', image: require('../../resources/side/5porion.webp') },
    { id: 6, name: 'Orbitale', image: require('../../resources/side/6orbitale.webp') },
    { id: 7, name: 'Tragus', image: require('../../resources/side/7tragus.webp') },
    { id: 8, name: 'Intertragic Notch', image: require('../../resources/side/8intertragicNotch.webp') },
    { id: 9, name: 'Corneal Apex', image: require('../../resources/side/9cornealApex.webp') },
    { id: 10, name: 'Cheekbone', image: require('../../resources/side/10cheekbone.webp') },
    { id: 11, name: 'Eyelid End', image: require('../../resources/side/11eyelidEnd.webp') },
    { id: 12, name: 'Lower Eyelid', image: require('../../resources/side/12lowerEyelid.webp') },
    { id: 13, name: 'Trichion', image: require('../../resources/side/13trichion.webp') },
    { id: 14, name: 'Glabella', image: require('../../resources/side/14glabella.webp') },
    { id: 15, name: 'Forehead', image: require('../../resources/side/15forehead.webp') },
    { id: 16, name: 'Nasion', image: require('../../resources/side/16nasion.webp') },
    { id: 17, name: 'Rhinion', image: require('../../resources/side/17rhinion.webp') },
    { id: 18, name: 'Supratip', image: require('../../resources/side/18supratip.webp') },
    { id: 19, name: 'Infratip', image: require('../../resources/side/19infratip.webp') },
    { id: 20, name: 'Columella', image: require('../../resources/side/20columella.webp') },
    { id: 21, name: 'Subnasale', image: require('../../resources/side/21subnasale.webp') },
    { id: 22, name: 'Subalare', image: require('../../resources/side/22subalare.webp') },
    { id: 23, name: 'Labrale Superius', image: require('../../resources/side/23labraleSuperius.webp') },
    { id: 24, name: 'Cheilion', image: require('../../resources/side/24cheilion.webp') },
    { id: 25, name: 'Labrale Inferius', image: require('../../resources/side/25labraleInferius.webp') },
    { id: 26, name: 'Sublabiale', image: require('../../resources/side/26sublabiale.webp') },
    { id: 27, name: 'Pogonion', image: require('../../resources/side/27pogonion.webp') },
    { id: 28, name: 'Menton', image: require('../../resources/side/28menton.webp') },
    { id: 29, name: 'Cervical Point', image: require('../../resources/side/29cervicalPoint.webp') },
    { id: 30, name: 'Gonion Top', image: require('../../resources/side/30gonionTop.webp') },
    { id: 31, name: 'Gonion Bottom', image: require('../../resources/side/31gonionBottom.webp') },
];
