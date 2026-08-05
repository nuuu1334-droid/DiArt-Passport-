DiArt Theme Database v1.0

Содержимое:
- theme_database_v1.0.json — 12 полностью заполненных визуальных тем.
- assets_database_v1.1.json — разрешение логических asset_id в реальные файлы.
- validation_report.json — автоматическая проверка структуры и ассетов.

Что зафиксировано:
- реальные цвета для каждой темы;
- утверждённые SVG-пины;
- градиенты и паттерны;
- Portrait Frame;
- Confidence Card;
- Harmony Scales;
- Color Orbit;
- Palette Gallery;
- Neutral Base;
- Accent Collection;
- Harmony Guide;
- DiArt Signature.

Важно:
SVG-шаблоны должны обращаться к токенам темы, например:
theme.colors.primary
theme.colors.surface
theme.components.color_orbit.orbit_color_token

Нельзя прописывать сезонные HEX напрямую внутри шаблонов.
