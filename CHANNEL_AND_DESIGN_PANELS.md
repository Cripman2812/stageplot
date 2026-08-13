# Kanal Yönetimi + 2D/3D Tasarım

Eklenen dosyalar:
- `src/components/ChannelManagementPanel.tsx`
- `src/components/StageDesignPanel.tsx`

`src/types/index.ts` içine `StageObject` için:
- `image2d?: string`
- `model3d?: string`
- `locked?: boolean`

alanları eklendi.

App tarafında:
- Kanal ekranında `<ChannelManagementPanel />`
- Tasarım ekranında `<StageDesignPanel />`

kullanılabilir.

Not: Projedeki mevcut reducer action isimleri farklıysa `ProjectContext.tsx` içindeki action isimleriyle eşleştirilmelidir. 3D GLB/GLTF dosyasının gerçek Three.js sahnesine yüklenmesi için Stage3D tarafında GLTFLoader bağlantısı ayrıca yapılmalıdır.
