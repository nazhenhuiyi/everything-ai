# Explorer Illustrator Reference

This guide defines the visual strategy and prompt construction for the `explore-things` skill.

## Visual Strategy (The "DK" Approach)

Our goal is to reveal the **inner workings** and **invisible logic**.

| Perspective | Description | Best For |
| :--- | :--- | :--- |
| **Cutaway (剖面图)** | Slicing through the object to see internal layers. | Engines, buildings, organs, batteries. |
| **Exploded (爆炸分解图)** | Drawing components separated but in their relative positions. | Complex assemblies, watches, LEGO. |
| **Microscopic (显微镜图)** | Zooming into the material or cellular level. | Fabric, leaves, chips, chemical reactions. |
| **Process (流程/原理图)** | Showing the flow of energy, information, or matter. | Photosynthesis, internet packets, weather. |

## Diagram Types (图的类型)

Individual type definitions are located in the [types](./types) directory. These define the **logical and structural approach** to the visualization.

| Type | Description | Reference |
| :--- | :--- | :--- |
| **Cutaway (剖面图)** | Slicing through to see internal layers. | [cutaway.md](./types/cutaway.md) |
| **Exploded (爆炸分解图)** | Components separated in relative positions. | [exploded.md](./types/exploded.md) |
| **Microscopic (显微镜图)** | Zooming into material/cellular level. | [microscopic.md](./types/microscopic.md) |
| **Process (流程/原理图)** | Showing flow of energy, info, or matter. | [process.md](./types/process.md) |
| **Macaulay (麦考利)** | Detailed line art, watercolor wash, warm. | [macaulay.md](./types/macaulay.md) |
| **DK Scientific** | High-definition, clean, 3D-rendered look. | [dk-scientific.md](./types/dk-scientific.md) |
| **Blueprint (蓝图)** | Technical drawing, white lines on blue background. | [blueprint.md](./types/blueprint.md) |
| **Conceptual (概念图)** | Abstract but logical, minimalist shapes. | [conceptual.md](./types/conceptual.md) |

## Artistic Styles (艺术风格)

Individual style definitions are located in the [styles](./styles) directory. These define the **aesthetic and color treatment**.

| Style | Description | Reference |
| :--- | :--- | :--- |
| **Playful (趣味/童趣)** | Whimsical doodles, sparkles, and cute characters. | [playful.md](./styles/playful.md) |
| **Watercolor (温润水彩)** | Soft brush strokes, organic shapes, natural feel. | [watercolor.md](./styles/watercolor.md) |
| **Chalkboard (黑板/手绘)** | Sketchy lines, chalk dust effects on dark background. | [chalkboard.md](./styles/chalkboard.md) |
| **Flat Doodle (简笔勾勒)** | Bold outlines with bright pastel fills. | [flat-doodle.md](./styles/flat-doodle.md) |
| **Warm (温馨感性)** | Cream background, rounded corners, friendly feel. | [warm.md](./styles/warm.md) |

## Prompt Construction Template

Use this structure for the `generate_image` prompt:

```markdown
[Subject Name] - [Perspective] View

VISUAL CONTEXT: [Describe the environment/isolation, e.g., "Isolated on clean white background"]
CORE REVEAL: [What is being shown? e.g., "Internal pistons and valves move in synchrony"]
LABELS & ANNOTATIONS: [List 3-5 key labels to be visually indicated]
COLOR PALETTE: [Semantic color choices]
STYLE GUIDES: [e.g., "Style of David Macaulay, detailed hatching, watercolor tones"]
TECHNICAL SPECS: [e.g., "Aspect Ratio 16:9, High Precision, Scientific Diagram"]
```

## Implementation Rules

1. **Strategic Placement**: Place images at moments of maximum "Hidden Complexity". 
2. **Fact Check Harmony**: The illustration must be scientifically consistent with the text.
3. **No Literal Metaphors**: If the text says "The CPU is the brain," do NOT draw a human brain. Draw the logic gates or silicon die.
4. **Language**: Labels in prompts should be in the user's language for the generation model.

Generated image saved to public/docs/images folder
