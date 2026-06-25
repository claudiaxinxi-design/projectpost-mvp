# ProjectPost MVP

A focused, dependency-free prototype for turning remodeling project photos into
editable social posts.

## Run locally

From this folder:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Product decisions represented in the prototype

- Remodelers and design-build contractors are the first target, rather than a
  broad set of small businesses.
- The workflow is photos → visual analysis → generate. Users are not asked to
  identify the project type, stage, location, or business details.
- Up to eight images can be added, reordered conceptually through main-photo
  selection, and removed one at a time.
- Version one produces an editable Instagram or Facebook draft with a more
  controlled title, caption, hashtags, regeneration, and separate copy actions
  for each field.
- Image analysis first classifies the post into one of ten approved template
  types. Generation fills that template instead of freely writing new copy.
- Users can correct the detected template without re-uploading the photos.
- An optional product/project detail field lets users supply exact cabinet
  collection names when image recognition is uncertain. User-supplied details
  take priority over the detected product name.
- Product details are converted into a complete sentence before entering a
  template. Each template has approved conversational variants, so regenerate
  changes wording and sentence flow without changing the post's intent or
  inventing new claims.
- Scheduling, accounts, analytics, carousel-specific copy and ordering,
  automatic publishing, and brand libraries are intentionally deferred.

This prototype uses structured local generation so the interaction can be
tested without an API key. A production build should replace `generatePost()`
with a multimodal model call while preserving the same confirmation step and
editable output.
