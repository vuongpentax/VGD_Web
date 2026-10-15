# 05 — Release Manifest Specification

## 1. Mục tiêu

Manifest là hợp đồng dữ liệu public giữa VGD_Plugins, VGD_Web và VGD Center. Mỗi version/channel/compatibility/asset chỉ có một giá trị canonical. Manifest giữ đầy đủ release history và con trỏ release hiện hành theo channel.

Repo đã audit nhưng chưa có shared manifest/workflow. Đề xuất canonical metadata/release-manifest.json và metadata/release-manifest.schema.json trong VGD_Plugins; đây là path dự kiến, chưa tồn tại. VGD_Web không giữ schema có thẩm quyền thứ hai.

## 2. Dữ liệu trong manifest và ngoài manifest

### Manifest canonical

- Schema version và generated timestamp.
- Product ID/name/slug/public visibility.
- `channels`: con trỏ `current_release_id` theo từng channel; `default_channel` chọn channel ưu tiên.
- `releases`: mảng lịch sử đầy đủ, không xóa release cũ khi có bản mới.
- Version, Git tag, release date, compatibility, `source_repository`.
- Release notes URL, RBZ filename, download URL, byte size, SHA-256.

Catalog record được phép tồn tại trước release đầu tiên: `lifecycle: in_development`, `channels: {}`, `releases: []`, `default_channel: null`. Trang vẫn có thể public để giới thiệu sản phẩm nhưng không được hiển thị version hay download. Khi có release, registry chuyển lifecycle thành `released`, lưu release record và thêm channel pointer. `VGD Center` có record `kind: manager` trong cùng manifest để trang Center lấy metadata từ một nguồn; việc Center tự cập nhật bản thân vẫn là tính năng riêng chưa được giả định.

### VGD_Web content

- Mô tả marketing hai ngôn ngữ.
- Features, workflows, FAQ, screenshots/video.
- Copy của hero, about/contact, roadmap.
- Docs/tutorial pages.

Không lưu giá hoặc license entitlement trong manifest Phase 1. “Free” là nhãn hiển thị tạm thời của website và không có nghĩa miễn phí vĩnh viễn.

## 3. Draft manifest example

~~~json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "schema_version": 1,
  "generated_at": "2026-10-14T00:00:00Z",
  "products": [
    {
      "id": "example-plugin",
      "name": "Example Plugin",
      "slug": "example-plugin",
      "kind": "plugin",
      "visibility": "public",
      "lifecycle": "in_development",
      "default_channel": null,
      "channels": {},
      "releases": []
    },
    {
      "id": "vgd-center",
      "name": "VGD Center",
      "slug": "center",
      "kind": "manager",
      "visibility": "public",
      "lifecycle": "in_development",
      "default_channel": null,
      "channels": {},
      "releases": []
    }
  ]
}
~~~

Đây là fixture mô tả trạng thái trước release, không phải manifest production. Không đưa giá trị sản phẩm/version giả lên website. Tên plugin chỉ mang tính minh họa.

## 4. Required and optional fields

| Field | Required | Validation |
|---|---:|---|
| schema_version | Yes | Integer supported by both consumers |
| generated_at | Yes | ISO 8601 date-time in UTC |
| products | Yes | Array with unique product IDs and route slugs |
| id | Yes | Stable lowercase ID; never derive from display name at runtime |
| name | Yes | Human-readable product name |
| slug | Yes | Stable, unique, locale-neutral route segment |
| kind | Yes | `plugin` or `manager`; VGD Center has one record in this registry |
| visibility | Yes | `public` or `hidden`; all selected Phase 1 catalog products are `public` |
| lifecycle | Yes | `in_development`, `released`, or `archived`; separate from channel/editorial status |
| default_channel | Yes | `stable`, `beta`, `alpha`, or `null` when no release is published |
| channels | Yes | Object keyed by channel; each pointer references a release ID in `releases`; empty before first release |
| releases | Yes | Full append-only release history; empty before first release |
| source_repository | Yes for each release | Exact GitHub `owner/repo` that owns this release asset; may differ from VGD_Plugins |
| version | Yes per release | Semantic Versioning string; prerelease labels allowed |
| tag | Yes per release | Exact Git tag associated with this release |
| released_at | Yes per release | ISO date or UTC timestamp; define one exact representation in schema |
| sketchup.minimum | Conditional | Explicit minimum version; do not infer |
| sketchup.maximum | No | Null or tested upper bound |
| sketchup.tested | No | Explicit list of tested SketchUp versions |
| release_notes_url | Yes per release | HTTPS URL to notes or GitHub Release |
| asset.filename | Yes | Exact uploaded RBZ filename |
| asset.url | Yes | HTTPS direct release asset URL |
| asset.size_bytes | Yes | Positive integer matching release asset |
| asset.sha256 | Yes | 64 hex characters; checksum covers exact RBZ bytes |

Compatibility model may expand to OS or SketchUp edition if required. Until confirmed per plugin, UI must say “đang xác nhận” rather than make an assumption.

## 5. Release channels

- stable: bản phát hành chính, default choice.
- beta: preview release, selectable in Center.
- alpha: early test release; explicit warning and opt-in.
- Product lifecycle (`in_development`/`released`/`archived`) belongs to the product registry and is not the same field as selected release channel.
- A channel may be absent if it has no published release. Do not point the channel at a draft or deleted asset.
- Each channel pointer must reference an existing release record. When channels are non-empty, `default_channel` must reference an existing channel. With no release, use `default_channel: null`, `lifecycle: in_development`, `channels: {}`, `releases: []`, and omit download CTA.

## 6. GitHub Release mapping

Use GitHub Release data for tag, release title/body, draft/prerelease, published date and release assets. The manifest adds product identity, user-facing channel mapping, compatibility and stable schema. Include a VGD Center entry so the website Center page reads its version, release notes and download metadata from the same source. This does not require the Center to self-update; that behavior must be confirmed separately. The exact tag naming convention remains TODO until repo rules are confirmed.

Release workflow:

1. Run unit/integration/package tests.
2. Build RBZ from approved source and inspect package contents.
3. Compute SHA-256 over the final RBZ.
4. Create a draft release and upload RBZ plus optional checksum file.
5. Verify uploaded asset name, size and digest.
6. Publish the release with correct channel/prerelease metadata.
7. Generate updated manifest from registry + published releases.
8. Validate schema and cross-field constraints.
9. Atomically update canonical manifest; fail the workflow if validation/update fails.
10. Smoke-test the manifest URL and download link.

Do not publish manifest entries before release assets are available. Do not update version manually in VGD_Web or Center.

## 7. Cross-field validation

- Product IDs and slugs are unique.
- Exactly one current public registry entry has kind manager and identifies VGD Center.
- A product is installable only when it has a published release with an available asset and valid checksum; public visibility alone is not installability.
- Default channel exists and has a version/asset.
- sha256 is exactly 64 hexadecimal characters.
- Asset URL is HTTPS and points to the expected repository release asset.
- Asset filename has .rbz; size is greater than zero.
- Release channel and GitHub prerelease flag agree by rule: stable is not prerelease; beta/alpha are prerelease unless exception is approved.
- Release date parses and cannot be in the future.
- Version/tag association is exact.
- A public release must not point at a draft.
- A product with no published channel must use `lifecycle: in_development`, an empty `channels` object, and `default_channel: null`; show its public product page without version/download claims.
- A product with one or more published channels must reference an existing channel in `default_channel` and use `lifecycle: released`.
- An archived product may retain release history but is not installable through the catalog by default.
- Owner decision: all production plugins selected for the catalog are public and temporarily Free. The ten repo folders are source inventory, not automatically ten catalog products; classify user-facing plugins versus manager/tooling before creating product records. Never seed release versions from Legacy.
- Hidden products are not rendered in catalog unless preview-only behavior is explicitly enabled.
- No unknown schema version silently falls back; consumer reports unsupported manifest.

## 8. JSON Schema skeleton

This is an initial machine-readable direction, not a finished file to copy without repo review. Codex should produce a complete schema and fixture tests in VGD_Plugins when the canonical path is chosen. JSON Schema handles field shapes; a consumer/CI validation step must enforce the lifecycle/channel cross-field rules above.

~~~
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["schema_version", "generated_at", "products"],
  "properties": {
    "schema_version": {"const": 1},
    "generated_at": {"type": "string", "format": "date-time"},
    "products": {
      "type": "array",
      "items": {"$ref": "#/$defs/product"}
    }
  },
  "$defs": {
    "product": {
      "type": "object",
      "required": ["id", "name", "slug", "kind", "visibility", "lifecycle", "default_channel", "channels", "releases"],
      "properties": {
        "id": {"type": "string", "pattern": "^[a-z0-9][a-z0-9-]*$"},
        "name": {"type": "string", "minLength": 1},
        "slug": {"type": "string", "pattern": "^[a-z0-9][a-z0-9-]*$"},
        "kind": {"enum": ["plugin", "manager"]},
        "visibility": {"enum": ["public", "hidden"]},
        "lifecycle": {"enum": ["in_development", "released", "archived"]},
        "default_channel": {"enum": ["stable", "beta", "alpha", null]},
        "channels": {"type": "object"},
        "releases": {"type": "array", "items": {"type": "object"}}
      },
      "additionalProperties": false
    }
  }
}
~~~

The skeleton intentionally leaves detailed release/asset definitions for implementation. Add strict schema for each nested object and cross-field tests. Channel pointers resolve by release ID; the website changelog reads the full `releases` history, while version badges read the current channel pointers.

## 9. Consumer and failure behavior

### VGD Web

- Validate incoming JSON against supported schema version.
- Cache server-side for proposed 300 seconds; do not fetch manifest in every client component.
- Keep previous valid cache/last generated static shell when upstream is temporarily unavailable.
- Show a discreet “release info may be delayed” state where freshness matters.
- Invalid manifest: do not render download URL; show safe fallback and log server-side diagnostics.
- Use plugin asset URL for shared release data validation only; the website install CTA routes to VGD Center and does not expose raw plugin RBZ as a parallel install path. The Center page may link to the Center RBZ release.

### VGD Center

- Read same stable manifest URL, respect user-selected channel.
- Verify downloaded bytes against SHA-256 before install/update.
- On digest mismatch, abort installation and report recovery steps.
- Ignore unknown optional fields; reject unsupported major schema versions.


## 10. Schema evolution and migration

- Start at schema_version 1.
- Add backward-compatible optional fields without changing meanings of existing fields.
- For incompatible changes, publish schema_version 2 only after Center and Web can both read it, or keep two compatible manifest versions during rollout.
- Keep product IDs stable through display name changes.
- Migrate release data from verified new-repo tags and releases only; do not migrate Legacy records as current releases without explicit validation.
- Keep previous manifest revisions in Git history. Roll back by reverting manifest data after deciding whether the release remains published.

## 11. Items to finalize before live release integration

- Approve/create proposed canonical manifest and schema paths; both are absent in the audited repo.
- Product registry location and current product IDs.
- Classify the ten source/manager folders into public product records versus tooling; owner has decided production catalog products are public. Confirm tag/channel conventions; repo has no tags/releases.
- RBZ naming pattern and release asset set.
- Create release workflow and decide trigger/manifest write permissions; .github/workflows/ is absent.
- Whether GitHub digest is available on every required asset or CI computes/stores SHA-256 independently.
- Add a VGD Center entry so its page reads the current version, notes and download metadata from this same registry; self-update behavior remains a separate decision.
- Include a product kind value such as plugin or manager, with VGD Center marked manager.


## 12. Audit update — 15/10/2026

Audit GitHub ngày 15/10/2026: repo vuongpentax/VGD_Plugins truy cập được, default branch main, HEAD e138359685452a5cece58bc093b4b9ec07dfbb18; PR #1 đã merge và remote branch list chỉ còn main. Repo có 10 thư mục plugins: VGD_BIM, VGD_Cabinet, VGD_Cabinet_Draw, VGD_Center, VGD_Dim, VGD_Image_Importer, VGD_Library, VGD_Package, VGD_Reference, VGD_Scenes. Đây là inventory source, chưa phải roster catalog. Snapshot chưa có GitHub Releases, tags, RBZ tracked files, .github/workflows/ hay shared manifest. plugins/VGD_Dim/VGD_UPDATE_MANIFEST.json là file updater riêng. Repo vuongpentax/VGD_Web đã tồn tại, default branch main nhưng Git tree rỗng. Không xem version labels/release-note files là release công khai.
Each release record must declare source_repository so assets can be validated when Center or a plugin uses another approved release repo. Changelog reads the full release history; channel pointers identify current versions.
