# Hero Image Layout Audit

| Page | Image file | Wrapper class | Placeholder/old background removed | Content/image height balanced | Mobile crop okay |
| --- | --- | --- | --- | --- | --- |
| / | assets/images/photos/hero/bharat-metals-stainless-steel-pipes-hero-v3.webp | hero-media | yes | yes | yes |
| /ss-304/ | ../assets/images/photos/materials/stainless-steel-mixed-stock-v3.webp | page-hero-media | yes | yes | yes |
| /stainless-steel-rods/ | ../assets/images/photos/product-forms/rods.webp | page-hero-media | yes | yes | yes |
| /stainless-steel-bars/ | ../assets/images/photos/product-forms/bars.webp | page-hero-media | yes | yes | yes |
| /stainless-steel-suppliers-renigunta/ | ../assets/images/photos/locations/south-india-logistics.webp | page-hero-media | yes | yes | yes |
| /industries/automobile-auto-components/ | ../../assets/images/photos/industries/automobile-auto-components.webp | page-hero-media | yes | yes | yes |
| /aluminium/ | ../assets/images/photos/materials/aluminium.webp | page-hero-media | yes | yes | yes |

CSS check: `.hero-media::before` and `.page-hero-media::before` are disabled; wrappers use overflow hidden and images use object-fit cover.
