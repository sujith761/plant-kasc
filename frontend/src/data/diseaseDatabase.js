// Complete Plant Disease Database with full details
export const diseaseDatabase = [
  {
    class: 'Apple___Apple_scab', plant: 'Apple', disease: 'Apple Scab',
    scientificName: 'Venturia inaequalis',
    description: 'Apple scab is a fungal disease caused by Venturia inaequalis. It leads to dark, olive-green to black lesions on leaves, fruit, and sometimes twigs. Severe infections cause premature leaf drop and deformed fruit.',
    symptoms: ['Olive-green to dark brown velvety spots on leaves', 'Dark scabby lesions on fruit surface', 'Premature leaf yellowing and drop', 'Cracked and deformed fruit', 'Stunted growth on young shoots'],
    causes: ['Fungal spores overwinter in fallen leaves', 'Wet and humid spring weather promotes spread', 'Wind and rain splash carry spores to new growth', 'Poor air circulation in dense canopy'],
    remedies: ['Apply fungicides (captan, myclobutanil) during early spring', 'Remove and destroy fallen infected leaves', 'Prune trees to improve air circulation', 'Use resistant apple varieties like Liberty or Enterprise'],
    prevention: ['Rake and dispose of fallen leaves in autumn', 'Apply dormant sprays before bud break', 'Maintain proper tree spacing', 'Choose scab-resistant cultivars', 'Avoid overhead irrigation'],
    severity: 'medium'
  },
  {
    class: 'Apple___Black_rot', plant: 'Apple', disease: 'Black Rot',
    scientificName: 'Botryosphaeria obtusa',
    description: 'Black rot is a serious fungal disease affecting apple fruit, leaves, and bark. It causes expanding brown lesions on fruit that eventually turn black, and characteristic "frog-eye" leaf spots.',
    symptoms: ['Large brown rotting areas on fruit with concentric rings', '"Frog-eye" leaf spots with purple borders', 'Bark cankers on limbs and trunk', 'Mummified fruit remaining on tree', 'Yellowing leaves with brown edges'],
    causes: ['Fungus overwinters in mummified fruit and cankers', 'Enters through wounds from insects or hail', 'Warm humid weather favors spread', 'Stressed or weakened trees are more susceptible'],
    remedies: ['Prune and remove all cankered limbs', 'Remove mummified fruit from trees and ground', 'Apply captan or thiophanate-methyl fungicide', 'Maintain tree vigor through proper fertilization'],
    prevention: ['Remove dead wood and mummified fruit annually', 'Control insect pests to prevent wounds', 'Avoid wounding trees during cultivation', 'Ensure good air circulation', 'Apply preventive fungicide sprays'],
    severity: 'high'
  },
  {
    class: 'Apple___Cedar_apple_rust', plant: 'Apple', disease: 'Cedar Apple Rust',
    scientificName: 'Gymnosporangium juniperi-virginianae',
    description: 'Cedar apple rust is a fungal disease requiring both apple/crabapple and Eastern red cedar to complete its life cycle. It causes bright orange-yellow spots on apple leaves and fruit.',
    symptoms: ['Bright yellow-orange spots on upper leaf surfaces', 'Tube-like structures on underside of leaves', 'Small raised lesions on fruit', 'Premature defoliation in severe cases', 'Reduced fruit size and quality'],
    causes: ['Spores produced on cedar galls in spring', 'Wind carries spores several miles to apple trees', 'Warm rainy spring weather promotes infection', 'Requires two host plants to complete lifecycle'],
    remedies: ['Apply fungicides like myclobutanil at pink bud stage', 'Remove nearby cedar and juniper trees if possible', 'Use resistant apple varieties', 'Apply protective sprays every 7-10 days in wet spring'],
    prevention: ['Plant rust-resistant varieties like Redfree or Liberty', 'Remove cedar trees within 2-mile radius', 'Apply preventive fungicides from green tip to petal fall', 'Monitor weather forecasts for infection periods'],
    severity: 'medium'
  },
  {
    class: 'Apple___healthy', plant: 'Apple', disease: 'Healthy',
    description: 'This apple plant shows no signs of disease. Leaves are uniformly green with no spots, lesions, or discoloration. The plant is in optimal health.',
    symptoms: [], causes: [], remedies: [], prevention: ['Continue regular watering and fertilization', 'Monitor for early signs of disease', 'Maintain proper pruning schedule', 'Apply preventive treatments as needed'],
    severity: 'low'
  },
  {
    class: 'Blueberry___healthy', plant: 'Blueberry', disease: 'Healthy',
    description: 'This blueberry plant is disease-free and showing normal, healthy growth. Leaves are vibrant green and properly formed.',
    symptoms: [], causes: [], remedies: [], prevention: ['Maintain acidic soil pH (4.5-5.5)', 'Provide consistent moisture with mulching', 'Prune annually for good air circulation', 'Monitor for pest activity'],
    severity: 'low'
  },
  {
    class: 'Cherry_(including_sour)___Powdery_mildew', plant: 'Cherry', disease: 'Powdery Mildew',
    scientificName: 'Podosphaera clandestina',
    description: 'Powdery mildew on cherry produces white powdery fungal growth on leaves, shoots, and sometimes fruit. It distorts new growth and reduces photosynthesis.',
    symptoms: ['White powdery coating on leaf surfaces', 'Curling and distortion of young leaves', 'Stunted shoot growth', 'Premature leaf drop', 'Reduced fruit quality'],
    causes: ['Fungal spores spread by wind', 'Warm days with cool nights favor development', 'High humidity without direct water on leaves', 'Dense canopy with poor air flow'],
    remedies: ['Apply sulfur-based fungicides early', 'Use potassium bicarbonate sprays', 'Neem oil applications for organic control', 'Prune to improve air circulation within canopy'],
    prevention: ['Select resistant varieties', 'Avoid excessive nitrogen fertilization', 'Space trees properly for airflow', 'Remove infected shoots promptly', 'Apply dormant season lime-sulfur'],
    severity: 'medium'
  },
  {
    class: 'Cherry_(including_sour)___healthy', plant: 'Cherry', disease: 'Healthy',
    description: 'This cherry plant is in excellent health with no visible disease symptoms. Leaves show normal color and form.',
    symptoms: [], causes: [], remedies: [], prevention: ['Maintain regular pruning', 'Ensure proper drainage', 'Monitor for early disease signs', 'Apply preventive fungicides if needed'],
    severity: 'low'
  },
  {
    class: 'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', plant: 'Corn (Maize)', disease: 'Gray Leaf Spot',
    scientificName: 'Cercospora zeae-maydis',
    description: 'Gray leaf spot is one of the most significant yield-limiting diseases of corn worldwide. It causes rectangular gray to tan lesions that run parallel to leaf veins.',
    symptoms: ['Rectangular gray-tan lesions between leaf veins', 'Lesions up to 2 inches long running parallel to veins', 'Lower leaves affected first, progressing upward', 'Severe cases cause complete blighting of leaves', 'Yield reduction up to 40% in severe outbreaks'],
    causes: ['Fungus survives in corn residue on soil surface', 'Prolonged periods of high humidity and warm temperatures', 'Continuous corn cropping increases risk', 'No-till farming retains infected debris'],
    remedies: ['Apply foliar fungicides like azoxystrobin at VT/R1 stage', 'Use strobilurin or triazole-based products', 'Scout fields regularly for early detection', 'Consider aerial application for large fields'],
    prevention: ['Rotate with non-host crops like soybeans', 'Tillage to bury infected crop residue', 'Plant resistant hybrids', 'Avoid continuous corn planting', 'Monitor humidity and schedule preventive sprays'],
    severity: 'high'
  },
  {
    class: 'Corn_(maize)___Common_rust_', plant: 'Corn (Maize)', disease: 'Common Rust',
    scientificName: 'Puccinia sorghi',
    description: 'Common rust is caused by the fungus Puccinia sorghi and produces small, circular to elongated reddish-brown pustules on both leaf surfaces. It is most common in cooler, humid conditions.',
    symptoms: ['Small circular reddish-brown pustules on both leaf surfaces', 'Pustules release powdery rust-colored spores when broken', 'Chlorotic halos around pustules', 'Premature leaf senescence in severe infections', 'Reduced grain fill'],
    causes: ['Spores carried by wind from southern regions', 'Cool temperatures (60-77°F) with high humidity', 'Heavy dew formation promotes infection', 'Susceptible hybrids planted in favorable conditions'],
    remedies: ['Apply foliar fungicides if infection is early and severe', 'Use triazole-based fungicides for control', 'Time applications before tasseling for best results', 'Scout regularly during cool humid periods'],
    prevention: ['Plant rust-resistant hybrids', 'Early planting to avoid peak spore periods', 'Monitor weather patterns for rust-favorable conditions', 'Balanced fertilization for plant vigor'],
    severity: 'medium'
  },
  {
    class: 'Corn_(maize)___Northern_Leaf_Blight', plant: 'Corn (Maize)', disease: 'Northern Leaf Blight',
    scientificName: 'Exserohilum turcicum',
    description: 'Northern leaf blight produces long, elliptical gray-green to tan lesions on corn leaves. Severe infections can lead to significant yield losses through reduced photosynthesis.',
    symptoms: ['Long elliptical cigar-shaped gray-green lesions (1-6 inches)', 'Lesions become tan as they mature', 'Lower leaves affected first', 'Severe blighting can kill entire leaves', 'Dark spore production gives lesions a dirty appearance'],
    causes: ['Fungus overwinters in infected crop debris', 'Moderate temperatures (65-80°F) with heavy dew', 'Rainy weather promotes spore release and infection', 'Continuous corn and reduced tillage increase risk'],
    remedies: ['Apply fungicides at or before tasseling', 'Use strobilurin or triazole fungicides', 'Target applications before disease reaches ear leaf', 'Combine resistant hybrids with fungicide for best control'],
    prevention: ['Plant resistant hybrids with Ht genes', 'Crop rotation with non-host crops', 'Tillage to decompose infected residue', 'Avoid late planting in high-risk areas'],
    severity: 'high'
  },
  {
    class: 'Corn_(maize)___healthy', plant: 'Corn (Maize)', disease: 'Healthy',
    description: 'This corn plant is in optimal health with no visible disease symptoms. Leaves are uniformly green with normal growth patterns.',
    symptoms: [], causes: [], remedies: [], prevention: ['Continue balanced fertilization', 'Maintain proper plant spacing', 'Scout regularly for diseases and pests', 'Ensure adequate irrigation'],
    severity: 'low'
  },
  {
    class: 'Grape___Black_rot', plant: 'Grape', disease: 'Black Rot',
    scientificName: 'Guignardia bidwellii',
    description: 'Black rot is one of the most destructive grape diseases. It causes tan leaf spots and rapid fruit decay where berries shrivel into hard, black mummies.',
    symptoms: ['Tan circular leaf spots with dark borders', 'Tiny black pycnidia in leaf spots', 'Light brown fruit rot spreading rapidly', 'Berries shrivel into hard black mummies', 'Shoot lesions appear as dark elongated cankers'],
    causes: ['Fungus overwinters in mummified berries', 'Warm wet weather (60-90°F) with 6+ hours of wetness', 'Rain splash disperses spores', 'Fruit most susceptible from bloom to veraison'],
    remedies: ['Apply mancozeb or myclobutanil from pre-bloom', 'Spray every 10-14 days during critical growth period', 'Remove all mummies and infected clusters', 'Combine cultural practices with chemical control'],
    prevention: ['Remove mummified fruit from vines and ground', 'Maintain open canopy for air circulation', 'Proper pruning and training to reduce humidity', 'Sanitation is the most important control measure'],
    severity: 'critical'
  },
  {
    class: 'Grape___Esca_(Black_Measles)', plant: 'Grape', disease: 'Esca (Black Measles)',
    scientificName: 'Phaeomoniella chlamydospora / Phaeoacremonium spp.',
    description: 'Esca, also called Black Measles, is a complex wood disease caused by multiple fungi. It affects the vascular system of grapevines and can cause sudden vine death or chronic decline.',
    symptoms: ['Tiger-stripe pattern on leaves (interveinal chlorosis with necrotic borders)', 'Dark spots or streaks on berries resembling measles', 'Internal wood decay with dark streaking', 'Sudden wilting and death of entire vine (apoplexy)', 'Gradual decline over multiple seasons'],
    causes: ['Multiple fungal pathogens infecting through pruning wounds', 'Fungi colonize xylem tissue blocking water transport', 'Stress from drought or nutrient deficiency worsens symptoms', 'Older vineyards (10+ years) more susceptible'],
    remedies: ['No complete cure exists for infected vines', 'Trunk renewal or vine surgery to remove diseased wood', 'Foliar application of sodium arsenite (where permitted)', 'Trichoderma-based biocontrol on pruning wounds', 'Severe cases require vine removal and replanting'],
    prevention: ['Protect pruning wounds with wound sealant or biocontrol', 'Prune during dry weather to minimize infection', 'Delay pruning as late as possible', 'Avoid large pruning wounds', 'Double pruning technique reduces infection risk'],
    severity: 'critical'
  },
  {
    class: 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', plant: 'Grape', disease: 'Leaf Blight',
    scientificName: 'Pseudocercospora vitis',
    description: 'Grape leaf blight (Isariopsis leaf spot) causes dark brown to black irregular spots on grape leaves, leading to premature defoliation and reduced vine vigor.',
    symptoms: ['Dark brown irregular spots on leaves', 'Spots may merge into larger blighted areas', 'Yellowing around lesions', 'Premature leaf drop from lower canopy', 'Reduced fruit quality and sugar content'],
    causes: ['Fungal spores spread by wind and rain splash', 'Warm humid conditions promote infection', 'Poor canopy management increases humidity', 'Fungus overwinters in fallen leaves'],
    remedies: ['Apply copper-based fungicides preventively', 'Use mancozeb or chlorothalonil sprays', 'Remove heavily infected leaves manually', 'Improve canopy airflow through hedging and leaf pulling'],
    prevention: ['Good canopy management for air circulation', 'Remove fallen leaves from vineyard floor', 'Balanced nutrition to maintain vine vigor', 'Regular scouting during growing season'],
    severity: 'medium'
  },
  {
    class: 'Grape___healthy', plant: 'Grape', disease: 'Healthy',
    description: 'This grapevine shows no signs of disease. Leaves are healthy green with normal growth and no spots or discoloration.',
    symptoms: [], causes: [], remedies: [], prevention: ['Maintain proper canopy management', 'Regular scouting for early disease detection', 'Balanced fertilization program', 'Proper irrigation practices'],
    severity: 'low'
  },
  {
    class: 'Orange___Haunglongbing_(Citrus_greening)', plant: 'Orange', disease: 'Huanglongbing (Citrus Greening)',
    scientificName: 'Candidatus Liberibacter asiaticus',
    description: 'Huanglongbing (HLB) or Citrus Greening is the most devastating citrus disease worldwide. It is caused by a bacterium spread by the Asian citrus psyllid insect and has no cure.',
    symptoms: ['Asymmetric blotchy mottling of leaves (not uniform yellowing)', 'Small lopsided and misshapen fruit', 'Fruit remains green even when mature', 'Bitter and unpleasant tasting juice', 'Premature fruit drop', 'Twig dieback and stunted growth'],
    causes: ['Bacterium Candidatus Liberibacter asiaticus', 'Transmitted by Asian citrus psyllid (Diaphorina citri)', 'Infected nursery stock spreads disease to new areas', 'Bacterium clogs phloem and disrupts nutrient flow'],
    remedies: ['No cure exists once tree is infected', 'Remove and destroy confirmed infected trees', 'Control psyllid populations with systemic insecticides', 'Nutritional therapy (enhanced foliar nutrition) can extend tree life', 'Thermotherapy (heat treatment) shows experimental promise'],
    prevention: ['Use certified disease-free nursery stock', 'Control Asian citrus psyllid with area-wide management', 'Regular scouting and testing of trees', 'Plant windbreaks to reduce psyllid movement', 'Report suspected cases to agricultural authorities'],
    severity: 'critical'
  },
  {
    class: 'Peach___Bacterial_spot', plant: 'Peach', disease: 'Bacterial Spot',
    scientificName: 'Xanthomonas arboricola pv. pruni',
    description: 'Bacterial spot causes water-soaked lesions on leaves, fruit, and twigs of peach trees. It leads to premature defoliation, cracked fruit, and reduced tree vigor.',
    symptoms: ['Small angular water-soaked spots on leaves', 'Leaf spots turn purple-brown with yellow halos', 'Shot-hole appearance as lesion centers fall out', 'Dark sunken lesions on fruit with cracks', 'Twig cankers in severe cases'],
    causes: ['Bacteria spread by wind-driven rain', 'Warm wet weather of 75-86°F with frequent rain', 'Bacteria overwinters in twig cankers', 'Sandy soils with low fertility increase susceptibility'],
    remedies: ['Apply copper-based bactericides during dormant season', 'Oxytetracycline sprays during growing season', 'Improve tree nutrition especially with zinc', 'Maintain tree vigor through proper fertilization'],
    prevention: ['Plant resistant varieties', 'Avoid overhead irrigation', 'Site selection with good air drainage', 'Windbreaks to reduce wind-driven rain spread', 'Proper spacing for air circulation'],
    severity: 'high'
  },
  {
    class: 'Peach___healthy', plant: 'Peach', disease: 'Healthy',
    description: 'This peach tree shows no signs of disease. Foliage is healthy with normal coloring and growth patterns.',
    symptoms: [], causes: [], remedies: [], prevention: ['Regular dormant season pruning', 'Balanced fertilization program', 'Monitor for early signs of bacterial or fungal disease', 'Apply dormant copper spray as preventive'],
    severity: 'low'
  },
  {
    class: 'Pepper,_bell___Bacterial_spot', plant: 'Pepper (Bell)', disease: 'Bacterial Spot',
    scientificName: 'Xanthomonas campestris pv. vesicatoria',
    description: 'Bacterial spot affects peppers causing water-soaked lesions on leaves and fruit. It thrives in warm, wet conditions and can cause significant defoliation and fruit damage.',
    symptoms: ['Small dark water-soaked spots on leaves', 'Spots become raised and scabby on fruit', 'Severe defoliation exposing fruit to sunscald', 'Yellowing and browning of leaf margins', 'Reduced fruit quality and marketability'],
    causes: ['Contaminated seed is primary source', 'Bacteria spread by splashing rain and overhead irrigation', 'Warm temperatures (75-86°F) with high moisture', 'Worker handling of wet plants spreads bacteria'],
    remedies: ['Copper hydroxide sprays combined with mancozeb', 'Remove and destroy severely infected plants', 'Avoid working with plants when foliage is wet', 'Apply bactericides at first sign of symptoms'],
    prevention: ['Use certified disease-free seed and transplants', 'Crop rotation (2-3 year) with non-host plants', 'Avoid overhead irrigation', 'Sanitize tools and equipment', 'Hot water seed treatment before planting'],
    severity: 'high'
  },
  {
    class: 'Pepper,_bell___healthy', plant: 'Pepper (Bell)', disease: 'Healthy',
    description: 'This bell pepper plant is healthy and free from any disease symptoms. Leaves are dark green and normally shaped.',
    symptoms: [], causes: [], remedies: [], prevention: ['Use disease-free seeds', 'Maintain proper spacing', 'Avoid overhead watering', 'Rotate crops annually'],
    severity: 'low'
  },
  {
    class: 'Potato___Early_blight', plant: 'Potato', disease: 'Early Blight',
    scientificName: 'Alternaria solani',
    description: 'Early blight is a common fungal disease of potatoes causing dark brown concentric target-like spots on older leaves. It can cause significant defoliation and reduce tuber yields.',
    symptoms: ['Dark brown spots with concentric rings (target-board pattern)', 'Spots appear first on older lower leaves', 'Yellowing around leaf lesions', 'Premature defoliation', 'Dark leathery spots on tubers', 'Collar rot on stems near soil line'],
    causes: ['Fungus overwinters in infected crop debris and soil', 'Warm temperatures (75-85°F) with alternating wet/dry periods', 'Heavy dew promotes spore germination', 'Nutrient deficiency and plant stress increase susceptibility'],
    remedies: ['Apply chlorothalonil or mancozeb fungicides', 'Start sprays when first symptoms appear', 'Improve plant nutrition with balanced fertilizer', 'Maintain consistent soil moisture to reduce stress'],
    prevention: ['Crop rotation (3+ years away from potatoes and tomatoes)', 'Use certified disease-free seed potatoes', 'Adequate fertilization (especially nitrogen)', 'Proper plant spacing for air circulation', 'Destroy infected crop debris after harvest'],
    severity: 'medium'
  },
  {
    class: 'Potato___Late_blight', plant: 'Potato', disease: 'Late Blight',
    scientificName: 'Phytophthora infestans',
    description: 'Late blight is one of the most destructive plant diseases in history, responsible for the Irish Potato Famine. It can destroy entire fields within days under favorable conditions.',
    symptoms: ['Water-soaked dark green-to-brown lesions on leaves', 'White fuzzy fungal growth on leaf undersides in humid conditions', 'Rapid wilting and blackening of foliage', 'Firm brown rot on tubers extending from surface inward', 'Distinctive foul odor from rapidly decaying tissue'],
    causes: ['Oomycete pathogen spreading rapidly in cool wet weather', 'Optimal at 50-60°F with near 100% humidity', 'Spores travel by wind up to 30+ miles', 'Infected seed tubers are primary source'],
    remedies: ['Apply protectant fungicides like chlorothalonil or mancozeb', 'Use systemic fungicides like metalaxyl for active infections', 'Destroy all infected plants immediately', 'Harvest tubers in dry conditions and cure before storage'],
    prevention: ['Plant only certified disease-free seed potatoes', 'Destroy volunteer potatoes and cull piles', 'Monitor late blight forecasting systems', 'Hill potatoes to protect tubers from spores', 'Avoid overhead irrigation in evening'],
    severity: 'critical'
  },
  {
    class: 'Potato___healthy', plant: 'Potato', disease: 'Healthy',
    description: 'This potato plant is in good health with no visible disease symptoms. Foliage is green and vibrant.',
    symptoms: [], causes: [], remedies: [], prevention: ['Use certified seed potatoes', 'Practice crop rotation', 'Monitor for blight-favorable weather', 'Maintain proper hilling and drainage'],
    severity: 'low'
  },
  {
    class: 'Raspberry___healthy', plant: 'Raspberry', disease: 'Healthy',
    description: 'This raspberry plant shows no signs of disease. Canes and leaves are healthy with strong growth patterns.',
    symptoms: [], causes: [], remedies: [], prevention: ['Remove old fruiting canes after harvest', 'Maintain good air circulation', 'Avoid overhead irrigation', 'Monitor for viral symptoms'],
    severity: 'low'
  },
  {
    class: 'Soybean___healthy', plant: 'Soybean', disease: 'Healthy',
    description: 'This soybean plant is disease-free with healthy green trifoliate leaves and normal growth.',
    symptoms: [], causes: [], remedies: [], prevention: ['Rotate with non-legume crops', 'Use disease-resistant varieties', 'Scout regularly during growing season', 'Maintain proper soil fertility'],
    severity: 'low'
  },
  {
    class: 'Squash___Powdery_mildew', plant: 'Squash', disease: 'Powdery Mildew',
    scientificName: 'Podosphaera xanthii',
    description: 'Powdery mildew is the most common disease of squash and cucurbits. It produces white powdery fungal growth on leaf surfaces, reducing photosynthesis and plant vigor.',
    symptoms: ['White powdery spots on upper and lower leaf surfaces', 'Spots enlarge and coalesce to cover entire leaves', 'Severely affected leaves yellow and die', 'Reduced fruit size and quality', 'Premature vine decline'],
    causes: ['Wind-dispersed fungal spores', 'Warm dry days with cool humid nights', 'Shaded conditions and dense plantings', 'Late-season plants often most affected'],
    remedies: ['Apply sulfur or potassium bicarbonate sprays', 'Neem oil for organic management', 'Myclobutanil or chlorothalonil for conventional control', 'Remove severely infected leaves to slow spread'],
    prevention: ['Plant resistant varieties', 'Ensure adequate spacing for airflow', 'Avoid excessive nitrogen fertilization', 'Plant in full sun locations', 'Early planting to harvest before peak infection period'],
    severity: 'medium'
  },
  {
    class: 'Strawberry___Leaf_scorch', plant: 'Strawberry', disease: 'Leaf Scorch',
    scientificName: 'Diplocarpon earlianum',
    description: 'Strawberry leaf scorch causes numerous small dark purple spots on strawberry leaves that coalesce, giving the leaves a scorched appearance. Severe infections weaken plants.',
    symptoms: ['Small dark purple spots on leaf upper surface', 'Spots coalesce giving burnt/scorched appearance', 'Leaf margins curl upward', 'Affected leaves dry out and become brown', 'Reduced runner production'],
    causes: ['Fungal spores spread by splashing rain', 'Warm humid weather promotes development', 'Overhead irrigation wets foliage', 'Dense plantings with poor air circulation'],
    remedies: ['Apply fungicides like captan or myclobutanil', 'Remove and destroy severely infected leaves', 'Renovate beds after harvest by mowing and thinning', 'Improve air circulation through proper spacing'],
    prevention: ['Plant resistant varieties', 'Avoid overhead irrigation', 'Proper plant spacing', 'Renovate strawberry beds annually', 'Remove old leaves in early spring'],
    severity: 'medium'
  },
  {
    class: 'Strawberry___healthy', plant: 'Strawberry', disease: 'Healthy',
    description: 'This strawberry plant is healthy with no disease symptoms. Leaves are bright green with normal growth.',
    symptoms: [], causes: [], remedies: [], prevention: ['Maintain proper watering schedule', 'Ensure good drainage', 'Renovate beds after fruiting', 'Monitor for pest and disease issues'],
    severity: 'low'
  },
  {
    class: 'Tomato___Bacterial_spot', plant: 'Tomato', disease: 'Bacterial Spot',
    scientificName: 'Xanthomonas vesicatoria',
    description: 'Bacterial spot causes small dark raised spots on tomato leaves, stems, and fruit. It thrives in warm, wet conditions and can cause severe defoliation and fruit damage.',
    symptoms: ['Small dark water-soaked leaf spots', 'Spots become raised and scabby on fruit', 'Defoliation exposing fruit to sunscald', 'Greasy-looking spots on green fruit', 'Stem and petiole lesions'],
    causes: ['Contaminated seed or infected transplants', 'Bacteria spread by rain splash and overhead irrigation', 'Warm humid weather (75-86°F)', 'Handling wet plants spreads bacteria'],
    remedies: ['Copper-based sprays combined with mancozeb', 'Remove severely infected plants', 'Avoid working in wet fields', 'Bacteriophage applications in some regions'],
    prevention: ['Use disease-free certified seed', 'Hot water seed treatment (122°F for 25 minutes)', 'Crop rotation for 2-3 years', 'Drip irrigation instead of overhead', 'Sanitize stakes and equipment'],
    severity: 'high'
  },
  {
    class: 'Tomato___Early_blight', plant: 'Tomato', disease: 'Early Blight',
    scientificName: 'Alternaria solani',
    description: 'Early blight is a common tomato disease causing brown spots with concentric rings (target spots) on older leaves. It progresses upward and can significantly reduce yields.',
    symptoms: ['Dark brown spots with concentric ring pattern on older leaves', 'Yellowing tissue around spots', 'Progressive defoliation from bottom up', 'Dark sunken lesions on stems (collar rot)', 'Leathery dark spots on fruit near stem end'],
    causes: ['Fungus overwinters in soil and crop debris', 'Warm weather (75-85°F) with moisture or dew', 'Stressed plants more susceptible', 'Splashing rain and overhead irrigation spread spores'],
    remedies: ['Apply chlorothalonil or copper fungicides', 'Remove infected lower leaves', 'Mulch to prevent soil splash', 'Maintain adequate plant nutrition'],
    prevention: ['Crop rotation (3 years)', 'Use resistant or tolerant varieties', 'Stake or cage plants for air circulation', 'Mulch heavily to prevent soil splash', 'Water at base of plants, not overhead'],
    severity: 'medium'
  },
  {
    class: 'Tomato___Late_blight', plant: 'Tomato', disease: 'Late Blight',
    scientificName: 'Phytophthora infestans',
    description: 'Late blight is a devastating disease that can kill tomato plants within days. The same pathogen caused the Irish Potato Famine. It spreads very rapidly in cool, wet weather.',
    symptoms: ['Large water-soaked dark brown lesions on leaves', 'White fuzzy mold on leaf undersides', 'Dark firm lesions on stems', 'Firm brown rot on green and ripe fruit', 'Rapid plant collapse and death'],
    causes: ['Oomycete pathogen thriving in cool wet conditions (50-65°F)', 'Spores spread by wind and rain for miles', 'High humidity near 100%', 'Infected transplants or volunteer tomatoes'],
    remedies: ['Apply fungicides immediately at first sign', 'Use chlorothalonil, mancozeb, or copper products', 'Remove and destroy all infected plants', 'Do not compost diseased material'],
    prevention: ['Monitor late blight forecasts in your region', 'Avoid overhead irrigation', 'Provide good air circulation', 'Remove volunteer tomato and potato plants', 'Use resistant varieties when available'],
    severity: 'critical'
  },
  {
    class: 'Tomato___Leaf_Mold', plant: 'Tomato', disease: 'Leaf Mold',
    scientificName: 'Passalora fulva (formerly Cladosporium fulvum)',
    description: 'Leaf mold primarily affects greenhouse-grown tomatoes. It causes pale greenish-yellow spots on upper leaf surfaces with olive-green to brown velvety mold on undersides.',
    symptoms: ['Pale greenish-yellow spots on upper leaf surface', 'Olive-green to brown velvety mold on leaf underside', 'Leaves curl, wither, and drop', 'Rarely affects stems or fruit', 'Blossoms may drop if infection is severe'],
    causes: ['High humidity (above 85%) in enclosed environments', 'Temperatures of 71-75°F are optimal for pathogen', 'Poor air circulation in greenhouses', 'Spores persist in soil and on greenhouse structures'],
    remedies: ['Improve greenhouse ventilation immediately', 'Apply chlorothalonil or mancozeb fungicides', 'Reduce humidity with fans and proper watering', 'Remove and destroy infected leaves'],
    prevention: ['Maintain greenhouse humidity below 85%', 'Space plants for good air circulation', 'Use drip irrigation instead of overhead', 'Sanitize greenhouse between seasons', 'Grow resistant varieties (many Cf-gene varieties available)'],
    severity: 'medium'
  },
  {
    class: 'Tomato___Septoria_leaf_spot', plant: 'Tomato', disease: 'Septoria Leaf Spot',
    scientificName: 'Septoria lycopersici',
    description: 'Septoria leaf spot is one of the most common and destructive tomato diseases. It causes numerous small spots with dark borders and gray centers on lower leaves.',
    symptoms: ['Numerous small circular spots (1/16 to 1/4 inch)', 'Spots have dark brown borders with gray-white centers', 'Tiny black pycnidia visible in spot centers', 'Severe defoliation from lower leaves upward', 'Fruit rarely affected but exposed to sunscald'],
    causes: ['Fungus overwinters on infected debris and solanaceous weeds', 'Splashing rain or irrigation spreads spores', 'Warm humid weather (68-77°F) promotes infection', 'Extended wet periods are critical for development'],
    remedies: ['Apply fungicides (chlorothalonil, mancozeb, copper)', 'Begin sprays at first sign on lower leaves', 'Remove infected lower leaves to slow progress', 'Spray every 7-10 days during wet weather'],
    prevention: ['Remove all tomato debris at end of season', 'Practice 3-year crop rotation', 'Mulch around plants to prevent soil splash', 'Stake or cage for better air flow', 'Drip irrigation to keep foliage dry'],
    severity: 'high'
  },
  {
    class: 'Tomato___Spider_mites Two-spotted_spider_mite', plant: 'Tomato', disease: 'Spider Mites',
    scientificName: 'Tetranychus urticae',
    description: 'Two-spotted spider mites are tiny arachnids that feed on tomato leaves by piercing cells and sucking contents. Severe infestations cause bronzing, defoliation, and yield loss.',
    symptoms: ['Fine stippling or yellow dots on upper leaf surface', 'Bronzing and drying of leaves', 'Fine webbing on leaf undersides and between leaves', 'Tiny moving dots visible with magnification', 'Severe defoliation and plant decline'],
    causes: ['Hot dry weather favors rapid population buildup', 'Dusty conditions stress plants and promote mites', 'Overuse of broad-spectrum insecticides kills natural predators', 'Drought-stressed plants are more susceptible'],
    remedies: ['Apply miticides like abamectin or spiromesifen', 'Strong water sprays to dislodge mites', 'Insecticidal soap or horticultural oil sprays', 'Release predatory mites (Phytoseiulus persimilis)', 'Neem oil applications for organic control'],
    prevention: ['Maintain adequate irrigation to reduce plant stress', 'Avoid dusty conditions near plantings', 'Preserve natural enemies by using selective pesticides', 'Monitor plants weekly with hand lens', 'Remove heavily infested plants promptly'],
    severity: 'high'
  },
  {
    class: 'Tomato___Target_Spot', plant: 'Tomato', disease: 'Target Spot',
    scientificName: 'Corynespora cassiicola',
    description: 'Target spot causes brown circular lesions with concentric rings on tomato leaves, stems, and fruit. It can cause significant defoliation and fruit damage in warm, humid climates.',
    symptoms: ['Brown circular spots with concentric rings on leaves', 'Spots on stems and petioles', 'Sunken brown spots on fruit', 'Severe defoliation in warm humid conditions', 'Lower canopy most severely affected'],
    causes: ['Fungus thrives in warm humid tropical/subtropical conditions', 'Spores spread by wind and rain splash', 'Dense canopy traps humidity around foliage', 'Fungus has wide host range including soybeans and cotton'],
    remedies: ['Apply chlorothalonil or azoxystrobin fungicides', 'Remove infected lower leaves', 'Improve air circulation through pruning', 'Alternate fungicide classes to prevent resistance'],
    prevention: ['Proper plant spacing and staking', 'Remove lower leaves touching soil', 'Drip irrigation to minimize leaf wetness', 'Crop rotation with non-susceptible crops', 'Clean up plant debris after season'],
    severity: 'medium'
  },
  {
    class: 'Tomato___Tomato_Yellow_Leaf_Curl_Virus', plant: 'Tomato', disease: 'Yellow Leaf Curl Virus',
    scientificName: 'Tomato yellow leaf curl virus (TYLCV)',
    description: 'TYLCV is a devastating viral disease transmitted by whiteflies. It causes severe stunting, leaf curling, and yellowing, with up to 100% yield loss in susceptible varieties.',
    symptoms: ['Upward curling and cupping of leaves', 'Severe stunting of plant growth', 'Yellowing of leaf margins and interveinal areas', 'Flower drop and reduced fruit set', 'Small and deformed fruit if any produced'],
    causes: ['Virus transmitted by silverleaf whitefly (Bemisia tabaci)', 'Whiteflies acquire virus in minutes of feeding', 'Virus persists in whitefly for life', 'Infected transplants introduce virus to new fields'],
    remedies: ['No cure for infected plants - remove and destroy them', 'Control whitefly populations with insecticides', 'Use reflective mulches to repel whiteflies', 'Imidacloprid or cyantraniliprole for whitefly control'],
    prevention: ['Plant TYLCV-resistant varieties (Ty-1, Ty-2 gene varieties)', 'Use insect-proof screens in nurseries', 'Install whitefly traps around fields', 'Remove infected plants immediately', 'Use virus-free transplants from certified nurseries'],
    severity: 'critical'
  },
  {
    class: 'Tomato___Tomato_mosaic_virus', plant: 'Tomato', disease: 'Tomato Mosaic Virus',
    scientificName: 'Tomato mosaic virus (ToMV)',
    description: 'Tomato mosaic virus causes mottled light and dark green patterns on leaves, leaf distortion, and reduced fruit yield. It is extremely stable and easily transmitted by touch.',
    symptoms: ['Light and dark green mosaic mottling of leaves', 'Leaf curling and distortion (fern-leaf appearance)', 'Stunted plant growth', 'Uneven fruit ripening with internal browning', 'Reduced fruit size and yield'],
    causes: ['Extremely stable virus surviving in soil and on surfaces for years', 'Spread mechanically through contaminated hands, tools, and clothing', 'Contaminated seed can carry the virus', 'Tobacco products can harbor related virus'],
    remedies: ['No cure - remove and destroy infected plants', 'Avoid touching healthy plants after handling infected ones', 'Disinfect hands and tools with milk or trisodium phosphate', 'Plant resistant varieties with Tm-2 gene'],
    prevention: ['Wash hands thoroughly before handling plants', 'Disinfect tools with 10% bleach or milk solution', 'Use certified virus-free seed', 'Do not smoke or use tobacco near tomato plants', 'Plant resistant varieties'],
    severity: 'high'
  },
  {
    class: 'Tomato___healthy', plant: 'Tomato', disease: 'Healthy',
    description: 'This tomato plant is in excellent health with vibrant green foliage, no spots, and normal growth patterns.',
    symptoms: [], causes: [], remedies: [], prevention: ['Rotate crops annually', 'Stake or cage for airflow', 'Water at base of plants', 'Monitor weekly for disease signs', 'Mulch to prevent soil splash'],
    severity: 'low'
  }
];

// Group diseases by plant
export const diseasesByPlant = diseaseDatabase.reduce((acc, item) => {
  if (!acc[item.plant]) {
    acc[item.plant] = [];
  }
  acc[item.plant].push(item);
  return acc;
}, {});

export const plantTypes = Object.keys(diseasesByPlant).sort();

// Quick lookup by class name
export const getDiseaseByClass = (className) => {
  return diseaseDatabase.find(d => d.class === className) || null;
};
