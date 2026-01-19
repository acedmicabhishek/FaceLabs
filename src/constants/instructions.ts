export const MEASUREMENT_INSTRUCTIONS: Record<string, string> = {
    // Angles
    gonial_angle: "Draw 3 points to form an angle: 1. Chin (Pog), 2. Gonion (Jaw corner), 3. Ear (Ar).",
    nasofrontal_angle: "Draw 3 points: 1. Glabella (Brow), 2. Nasion (Nose root), 3. Rhinion (Nose bridge).",
    mandibular_plane_angle: "Draw 3 points: 1. Menton (Bottom chin), 2. Gonion (Jaw corner), 3. Porion (Ear canal).",
    nasofacial_angle: "Draw 3 points: 1. Glabella (Brow), 2. Nasion (Nose root), 3. Pogonion (Chin tip).",
    nasolabial_angle: "Draw 3 points: 1. Columella (Nose base), 2. Subnasale, 3. Upper Lip (Labrale Superius).",
    mentolabial_angle: "Draw 3 points: 1. Lower Lip (Labrale Inferius), 2. Sublabiale (Chin fold), 3. Pogonion (Chin tip).",
    facial_convexity: "Draw 3 points: 1. Glabella, 2. Subnasale, 3. Pogonion.",
    total_facial_convexity: "Draw 3 points: 1. Glabella, 2. Pronasale (Nose tip), 3. Pogonion.",
    facial_convexity_nasion: "Draw 3 points: 1. Nasion, 2. Subnasale, 3. Pogonion.",
    submental_cervical: "Draw 3 points: 1. Neck point, 2. Cervical point (throat), 3. Menton (Chin under).",
    ipsilateral_alar_angle: "Draw 3 points outlining the nostril wing angle.",
    medial_canthal_angle: "Draw 3 points at the inner eye corner.",
    canthal_tilt: "Draw 2 points: 1. Inner eye corner, 2. Outer eye corner. Angle is measured relative to horizontal.",
    eyebrow_tilt: "Draw 2 points along the eyebrow axis.",
    zygomatic_angle: "Draw 3 points: 1. Zygo Left, 2. Nasion/Midpoint, 3. Zygo Right.",
    browridge_inclination_angle: "Draw angle of the brow ridge slope.",
    nasal_tip_angle: "Draw angle of the nasal tip.",
    nasomental_angle: "Draw angle between nose tip and chin.",
    deviation_iaa_jfa: "Draw 2 separate angles: 1. Ipsilateral Alar Angle, 2. Jaw Frontal Angle (or vice versa).",
    jfa: "Draw 3 points: 1. Cheek/Jaw top, 2. Chin side, 3. Chin center?",
    glabella_convexity: "Draw angle of glabella prominence.",

    // Ratios (Order Matters for s1/s2!)
    // Default FreeStyleMapper ratio is s2/s1 (2nd Line / 1st Line).
    // EXCEPT for specific overrides (fwhr, lower_jaw_to_neck_ratio, ramus_mandible_ratio) which use s1/s2.

    // Normal Ratios (s2/s1):
    chin_philtrum_ratio: "Draw Philtrum height first (1), then Chin height (2).",
    esr: "Draw Eye Width first (1), then Distance between eyes (2).",
    nasal_projection: "Draw Nasal Height first (1), then Nasal Projection depth (2).",
    nasal_w_h_ratio: "Draw Nasal Height first (1), then Nasal Width (2).",
    midface_ratio: "Draw eye distance (1), then Midface Height to the upper lip (2).",
    eye_aspect_ratio: "Draw Eye Height first (1), then Eye Width (2).",
    mouth_nose_width_ratio: "Draw Nose Width first (1), then Mouth Width (2).",
    malar_orbit_ratio: "Draw Orbit height first (1), then Malar height (2).",
    brow_sterness: "Draw Eye-Brow distance first (1), then Eye Height (2).",
    eyebrow_position_ratio: "Draw Eye Height first (1), then Brow-Eye distance (2).",
    lower_lip_to_upper_lip_ratio: "Draw Upper Lip height first (1), then Lower Lip height (2).",
    ricketts_e_line: "Draw E-Line (Nose-Chin) first, then measure Lip distance.",

    // Overrides (s1/s2):
    // fwhr: Height / Width
    fwhr: "Draw Face Height first (1), then Bizygomatic Width (2).",

    // lower_jaw_to_neck_ratio: Jaw / Neck
    lower_jaw_to_neck_ratio: "Draw Lower Jaw Width first (1), then Neck Width (2).",

    // ramus_mandible_ratio: Ramus / Mandible
    ramus_mandible_ratio: "Draw Ramus (vertical jaw) first (1), then Mandible (horizontal jaw) (2).",

    // Percentages / Lengths / Others
    facial_thirds: "Draw 3 vertical lines: 1. Hairline to browridge, 2. Browridge to nose tip, 3. Nose tip to chin.",
    lower_third_proportion: "Draw nose tip to mid lip, then lip mid line to chin.",
    bitemporal_width: "Draw Bizygomatic Width first (Total), then Bitemporal Width.",
    bigonial_width: "Draw Bizygomatic Width first (Total), then Bigonial Width.",
    cheekbone_height: "Draw Face Height first, then Cheekbone vertical position.",
    lower_full_face_ratio: "Draw Total Face Height first, then Lower Face Height.",
    neck_width: "Draw Jaw Width first, then Neck Width.", // Deprecated but might exist
    orbit_vector: "Draw a line indicating the orbital vector (positive/negative).",
    width_height_ratio: "Draw Width first, then Height.",
};
