export interface MeasurementDefinition {
    id: string;
    name: string;
    type: 'angle' | 'ratio' | 'length' | 'percentage';
    view: 'front' | 'side' | 'both';
    description?: string;
    genderSpecific?: boolean;
    pillar?: 'Harmony' | 'Dimorphism' | 'Angularity' | 'Soft Tissue';
}

export const MEASUREMENTS: MeasurementDefinition[] = [
    { id: 'gonial_angle', name: 'Gonial Angle', type: 'angle', view: 'side', genderSpecific: true, pillar: 'Angularity', description: 'Angle of the jawline corner.' },
    { id: 'nasofrontal_angle', name: 'Nasofrontal Angle', type: 'angle', view: 'side', genderSpecific: true, pillar: 'Dimorphism', description: 'Angle between forehead and nose bridge.' },
    { id: 'mandibular_plane_angle', name: 'Mandibular Plane Angle', type: 'angle', view: 'side', genderSpecific: true, pillar: 'Angularity', description: 'Angle of the lower jaw inclination.' },
    { id: 'ramus_mandible_ratio', name: 'Ramus to Mandible Ratio', type: 'ratio', view: 'side', genderSpecific: true, pillar: 'Angularity', description: 'Ratio of vertical jaw branch to horizontal jawline.' },
    { id: 'facial_thirds', name: 'Facial Thirds', type: 'percentage', view: 'front', genderSpecific: false, pillar: 'Harmony', description: 'Balance of upper, middle, and lower face heights.' },
    { id: 'chin_philtrum_ratio', name: 'Chin to Philtrum Ratio', type: 'ratio', view: 'side', genderSpecific: true, pillar: 'Harmony', description: 'Ratio of chin height to philtrum length.' },
    { id: 'esr', name: 'Eye Spacing Ratio (ESR)', type: 'ratio', view: 'front', genderSpecific: true, pillar: 'Harmony', description: 'Distance between eyes divided by total face width.' },
    { id: 'fwhr', name: 'Facial Width to Height Ratio (FWHR)', type: 'ratio', view: 'front', genderSpecific: true, pillar: 'Dimorphism', description: 'Bizygomatic width divided by face height.' },
    { id: 'bitemporal_width', name: 'Bitemporal Width', type: 'percentage', view: 'front', genderSpecific: true, pillar: 'Dimorphism', description: 'Width of the forehead at the temples.' },
    { id: 'lower_third_proportion', name: 'Lower Third Proportion', type: 'percentage', view: 'front', genderSpecific: true, pillar: 'Harmony', description: 'Percentage of face height occupied by the lower third.' },
    { id: 'lower_jaw_to_neck_ratio', name: 'Lower Jaw to Neck Ratio', type: 'ratio', view: 'front', genderSpecific: true, pillar: 'Dimorphism', description: 'Ratio of lower jaw width to neck width.' },
    { id: 'ipsilateral_alar_angle', name: 'Ipsilateral Alar Angle', type: 'angle', view: 'front', genderSpecific: true, pillar: 'Soft Tissue', description: 'Angle of the nostril wing.' },
    { id: 'medial_canthal_angle', name: 'Medial Canthal Angle', type: 'angle', view: 'front', genderSpecific: true, pillar: 'Soft Tissue', description: 'Angle of the inner eye corner.' },
    { id: 'canthal_tilt', name: 'Canthal Tilt', type: 'angle', view: 'front', genderSpecific: true, pillar: 'Dimorphism', description: 'Angle of the eye axis (inner to outer corner).' },
    { id: 'width_height_ratio', name: 'Total Height to Width Ratio', type: 'ratio', view: 'front', genderSpecific: true, pillar: 'Harmony', description: 'Overall face shape proportion.' },
    { id: 'submental_cervical', name: 'Submental Cervical Angle', type: 'angle', view: 'side', genderSpecific: true, pillar: 'Soft Tissue', description: 'Angle under the chin/neck.' },
    { id: 'bigonial_width', name: 'Bigonial Width', type: 'percentage', view: 'front', genderSpecific: true, pillar: 'Angularity', description: 'Width of the jaw at the gonions.' },
    { id: 'mentolabial_angle', name: 'Mentolabial Angle', type: 'angle', view: 'side', genderSpecific: true, pillar: 'Soft Tissue', description: 'Angle between lower lip and chin.' },
    { id: 'ricketts_e_line', name: 'Rickett\'s E-Line', type: 'ratio', view: 'side', genderSpecific: false, pillar: 'Harmony', description: 'Lip position relative to nose-chin line.' },
    { id: 'nasofacial_angle', name: 'Nasofacial Angle', type: 'angle', view: 'side', genderSpecific: true, pillar: 'Dimorphism', description: 'Protrusion of the nose relative to the face.' },
    { id: 'midface_ratio', name: 'Midface Ratio', type: 'ratio', view: 'front', genderSpecific: true, pillar: 'Harmony', description: 'Compactness of the midface region.' },
    { id: 'eye_aspect_ratio', name: 'Eye Aspect Ratio', type: 'ratio', view: 'front', genderSpecific: true, pillar: 'Dimorphism', description: 'Width to height ratio of the eye opening.' },
    { id: 'mouth_nose_width_ratio', name: 'Mouth Width to Nose Width Ratio', type: 'ratio', view: 'front', genderSpecific: true, pillar: 'Harmony', description: 'Relative width of mouth vs nose.' },
    { id: 'eyebrow_tilt', name: 'Eyebrow Tilt', type: 'angle', view: 'front', genderSpecific: true, pillar: 'Dimorphism', description: 'Angle of the eyebrows.' },
    { id: 'zygomatic_angle', name: 'Zygomaxillary Angle', type: 'angle', view: 'front', genderSpecific: true, pillar: 'Angularity', description: 'Angle defining cheekbone prominence.' },
    { id: 'malar_orbit_ratio', name: 'Malar-to-Orbit Ratio', type: 'ratio', view: 'side', genderSpecific: true, pillar: 'Angularity', description: 'High cheekbone position indicator.' },
    { id: 'brow_sterness', name: 'Brow Sterness', type: 'ratio', view: 'side', genderSpecific: true, pillar: 'Dimorphism', description: 'Proximity of brow to eye (set).' },
    { id: 'glabella_convexity', name: 'Glabella Convexity', type: 'angle', view: 'side', genderSpecific: true, pillar: 'Dimorphism', description: 'Prominence of the brow ridge.' },
    { id: 'lower_full_face_ratio', name: 'Lower to Full Face Ratio', type: 'percentage', view: 'side', genderSpecific: true, pillar: 'Harmony', description: 'Lower face height vs total face height.' },
    { id: 'jfa', name: 'Frontal Jaw Angle (JFA)', type: 'angle', view: 'front', genderSpecific: true, pillar: 'Angularity', description: 'Angle of the jawline from front view.' },
    { id: 'nasolabial_angle', name: 'Nasolabial Angle', type: 'angle', view: 'side', genderSpecific: true, pillar: 'Soft Tissue', description: 'Angle between nose base and upper lip.' },
    { id: 'facial_convexity', name: 'Facial Convexity', type: 'angle', view: 'side', genderSpecific: true, pillar: 'Harmony', description: 'Angle of total face profile (Glabella-Subnasale-Pogonion).' },
    { id: 'orbit_vector', name: 'Orbital Vector', type: 'length', view: 'side', genderSpecific: false, pillar: 'Soft Tissue', description: 'Eye support/undereye area.' },
    { id: 'total_facial_convexity', name: 'Total Facial Convexity', type: 'angle', view: 'side', genderSpecific: true, pillar: 'Harmony', description: 'Overall convexity of the face.' },
    { id: 'facial_convexity_nasion', name: 'Facial Convexity (Nasion)', type: 'angle', view: 'side', genderSpecific: true, pillar: 'Harmony', description: 'Convexity measured at the nasion.' },
    { id: 'nasal_projection', name: 'Nasal Projection', type: 'ratio', view: 'side', genderSpecific: true, pillar: 'Soft Tissue', description: 'Projection of the nose.' },
    { id: 'nasal_w_h_ratio', name: 'Nasal W to H Ratio', type: 'ratio', view: 'side', genderSpecific: true, pillar: 'Dimorphism', description: 'Ratio of nasal width to height.' },
    { id: 'nasomental_angle', name: 'Nasomental Angle', type: 'angle', view: 'side', genderSpecific: true, pillar: 'Soft Tissue', description: 'Angle between nose and chin.' },
    { id: 'browridge_inclination_angle', name: 'Browridge Inclination Angle', type: 'angle', view: 'side', genderSpecific: true, pillar: 'Dimorphism', description: 'Inclination of the brow ridge.' },
    { id: 'nasal_tip_angle', name: 'Nasal Tip Angle', type: 'angle', view: 'side', genderSpecific: true, pillar: 'Soft Tissue', description: 'Angle of the nasal tip.' },
    { id: 'cheekbone_height', name: 'Cheekbone Height', type: 'percentage', view: 'front', genderSpecific: true, pillar: 'Angularity', description: 'Vertical position of the cheekbones.' },
    { id: 'eyebrow_position_ratio', name: 'Eyebrow Position Ratio', type: 'ratio', view: 'front', genderSpecific: true, pillar: 'Dimorphism', description: 'Position of eyebrows relative to eyes.' },
    { id: 'lower_lip_to_upper_lip_ratio', name: 'Lower Lip to Upper Lip Ratio', type: 'ratio', view: 'side', genderSpecific: true, pillar: 'Harmony', description: 'Ratio of lower lip thickness to upper lip.' },
    { id: 'deviation_iaa_jfa', name: 'Deviation of IAA & JFA', type: 'angle', view: 'front', genderSpecific: true, pillar: 'Harmony', description: 'Deviation between Ipsilateral Alar Angle and Jaw Frontal Angle.' },
];

