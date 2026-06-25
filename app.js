const imageInput = document.querySelector("#image-input");
const dropzone = document.querySelector("#dropzone");
const imagePreview = document.querySelector("#image-preview");
const previewImage = document.querySelector("#preview-image");
const fileName = document.querySelector("#file-name");
const imageInsight = document.querySelector("#image-insight");
const removeImageButton = document.querySelector("#remove-image");
const thumbnailStrip = document.querySelector("#thumbnail-strip");
const sampleButton = document.querySelector("#sample-button");
const generateButton = document.querySelector("#generate-button");
const postForm = document.querySelector("#post-form");
const emptyOutput = document.querySelector("#empty-output");
const generatedOutput = document.querySelector("#generated-output");
const outputTitle = document.querySelector("#output-title");
const outputCaption = document.querySelector("#output-caption");
const outputHashtags = document.querySelector("#output-hashtags");
const characterCount = document.querySelector("#character-count");
const specificityLabel = document.querySelector("#specificity-label");
const regenerateButton = document.querySelector("#regenerate-button");
const analysisTitle = document.querySelector("#analysis-title");
const analysisSummary = document.querySelector("#analysis-summary");
const analysisTags = document.querySelector("#analysis-tags");
const templateSelect = document.querySelector("#template-select");
const productContext = document.querySelector("#product-context");
const toast = document.querySelector("#toast");
const fieldCopyButtons = [...document.querySelectorAll("[data-copy-target]")];
const platformTabs = [...document.querySelectorAll("[data-platform]")];
const progressItems = [...document.querySelectorAll("[data-progress]")];

const MAX_IMAGES = 8;
let imageItems = [];
let activeImageId = "";
let currentPlatform = "Instagram";
let variation = 0;
let selectedTemplate = "PROJECT_SHOWCASE";
let templateManuallyChanged = false;

const brandProfile = {
  category: "Cabinet supplier",
  location: "Houston, TX",
  audiences: "contractors, builders, remodelers, and dealers",
  benefits: ["Reliable inventory", "Consistent quality", "Fast turnaround", "Full kitchen solutions"],
  onlineOrdering: "Shop online 24/7",
};

const templateLabels = {
  PROJECT_SHOWCASE: "Completed Project Showcase",
  WHITE_SHAKER: "White Shaker Product",
  TWO_TONE_KITCHEN: "Two-Tone Kitchen",
  CONTRACTOR: "Contractor Focused",
  DEALER: "Dealer Recruitment",
  IN_STOCK: "Inventory / In Stock",
  NEW_COLLECTION: "New Collection Launch",
  HOMEOWNER_INSPIRATION: "Homeowner Inspiration",
  BEFORE_AFTER: "Before & After",
  PROMOTION: "Seasonal Promotion",
};

function normalizeProductDetails(value) {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .replace(/^(product|collection|featured product|project details)\s*:\s*/i, "")
    .replace(/^our\s+/i, "our ")
    .replace(/[.!?]+$/, "");
}

function completeSentence(value) {
  const cleaned = value.trim();
  if (!cleaned) return "";
  return `${cleaned.charAt(0).toUpperCase()}${cleaned.slice(1)}${/[.!?]$/.test(cleaned) ? "" : "."}`;
}

function buildProductCopy(profile) {
  const supplied = normalizeProductDetails(productContext.value);
  const fallback =
    selectedTemplate === "TWO_TONE_KITCHEN"
      ? "White Shaker uppers with Maple Shaker base cabinets"
      : profile.product;
  const product = supplied || fallback;
  const isCompleteThought = /\b(features?|includes?|uses?|pairs?|combines?|showcases?)\b/i.test(product);
  const featureSentence = isCompleteThought
    ? completeSentence(product)
    : `This kitchen features ${product}.`;
  const completedProjectSentence = isCompleteThought
    ? completeSentence(product)
    : `This completed project features ${product}.`;

  return {
    product,
    supplied,
    featureSentence,
    completedProjectSentence,
  };
}

const templateLibrary = {
  PROJECT_SHOWCASE: {
    titles: ["✨ Another Beautiful Kitchen Transformation", "✨ Another Kitchen Transformation We Love"],
    captions: [
      ({ completedProjectSentence }) =>
        `From design to installation, we love seeing our cabinets come to life.\n\n${completedProjectSentence} The result feels warm, timeless, and ready for everyday life.\n\n✔ In Stock\n✔ Fast Turnaround\n✔ Contractor Pricing Available\n\nReady for your next kitchen project?\n\n📍 ${brandProfile.location}`,
      ({ completedProjectSentence }) =>
        `There’s nothing better than seeing a finished kitchen come together.\n\n${completedProjectSentence} It’s a practical, polished combination that gives homeowners a timeless look without slowing down the project.\n\n✔ In Stock\n✔ Fast Turnaround\n✔ Contractor Pricing Available\n\nWorking on a kitchen next?\n\n📍 ${brandProfile.location}`,
    ],
    hashtags: ["#KitchenTransformation", "#KitchenProject", "#KitchenRemodel", "#CabinetSupplier", "#HoustonContractors", "#RTACabinets"],
  },
  WHITE_SHAKER: {
    titles: ["🤍 White Shaker Never Goes Out of Style", "🤍 A Classic Contractors Keep Coming Back To"],
    captions: [
      ({ featureSentence }) =>
        `Clean. Bright. Timeless.\n\n${featureSentence} It’s easy to design around, pairs well with nearly any countertop, and gives homeowners a look that never feels dated.\n\nWhether you’re remodeling one kitchen or building several homes, it’s a dependable choice.\n\n${brandProfile.onlineOrdering}.`,
      ({ featureSentence }) =>
        `Some cabinet styles make every design decision easier.\n\n${featureSentence} The clean lines keep the room feeling open, while the neutral finish works across modern, transitional, and classic kitchens.\n\nA contractor favorite for good reason.\n\n${brandProfile.onlineOrdering}.`,
    ],
    hashtags: ["#WhiteShakerCabinets", "#CabinetSupplier", "#KitchenRemodel", "#ContractorLife", "#WholesaleCabinets", "#RTACabinets"],
  },
  TWO_TONE_KITCHEN: {
    titles: ["✨ White Shaker + Maple Shaker. The Perfect Balance.", "✨ Two Finishes That Work Better Together"],
    captions: [
      ({ featureSentence }) =>
        `Why choose one finish when you can have both?\n\n${featureSentence} The lighter upper cabinets keep the room open and bright, while the warmer base cabinets add natural contrast.\n\nIt’s easy to see why this combination is requested so often.`,
      ({ featureSentence }) =>
        `Two finishes, one balanced kitchen.\n\n${featureSentence} Together, they add contrast without making the space feel busy—clean on top, warm and grounded below.\n\nA fresh take on a timeless layout.`,
    ],
    hashtags: ["#TwoToneKitchen", "#WhiteShaker", "#MapleShaker", "#KitchenDesign", "#CabinetSupplier", "#KitchenInspiration"],
  },
  CONTRACTOR: {
    titles: ["Built for Contractors. Loved by Homeowners.", "Keep the Job Moving."],
    captions: [
      ({ supplied, featureSentence }) =>
        `When deadlines matter, inventory matters.${supplied ? `\n\n${featureSentence}` : ""}\n\nOur contractor partners rely on us for:\n\n✔ Consistent Inventory\n✔ Fast Pickup\n✔ Reliable Lead Times\n✔ Full Kitchen Packages\n\nLet’s keep your projects moving.`,
      ({ supplied, featureSentence }) =>
        `The right cabinets are only helpful if they’re ready when the job is.${supplied ? `\n\n${featureSentence}` : ""}\n\nThat’s why contractors count on us for dependable inventory, clear lead times, fast pickup, and complete kitchen packages.\n\nLess waiting. More building.`,
    ],
    hashtags: ["#ContractorLife", "#BuilderLife", "#RemodelingContractor", "#CabinetSupplier", "#HoustonContractors", "#WholesaleCabinets"],
  },
  DEALER: {
    titles: ["Looking for Cabinet Dealer Pricing?", "Grow Your Business with Dealer Pricing"],
    captions: [
      ({ supplied, featureSentence }) =>
        `Join our dealer program and unlock exclusive pricing designed for contractors, remodelers, builders, and showrooms.${supplied ? `\n\n${featureSentence}` : ""}\n\nBenefits include:\n\n✔ Dealer Discounts\n✔ Priority Support\n✔ Full Product Access\n\nApply online today.`,
      ({ supplied, featureSentence }) =>
        `Better pricing. More product access. Support when you need it.${supplied ? `\n\n${featureSentence}` : ""}\n\nOur dealer program is built for industry professionals who want dependable cabinet options and a team that understands project timelines.\n\n✔ Dealer Discounts\n✔ Priority Support\n✔ Full Product Access\n\nApply online today.`,
    ],
    hashtags: ["#CabinetDealer", "#DealerProgram", "#ContractorPricing", "#CabinetSupplier", "#Builders", "#Remodelers"],
  },
  IN_STOCK: {
    titles: ["🚚 Cabinets In Stock and Ready to Go", "Need Cabinets Fast? Start Here."],
    captions: [
      ({ supplied, product }) =>
        `Need cabinets fast?\n\n${supplied ? `${product} is currently available for pickup or ordering.` : "Most of our popular cabinet collections are currently in stock and available for immediate pickup or ordering."}\n\nNo long waits.\nNo unnecessary delays.\n\nJust cabinets when you need them.`,
      ({ supplied, product }) =>
        `Your project shouldn’t have to wait on cabinets.\n\n${supplied ? `We currently have ${product} ready to order.` : "Popular cabinet collections are available now for fast pickup or ordering."}\n\nPlan with confidence and keep the job moving.`,
    ],
    hashtags: ["#CabinetsInStock", "#FastTurnaround", "#CabinetSupplier", "#ContractorLife", "#HoustonContractors", "#RTACabinets"],
  },
  NEW_COLLECTION: {
    titles: ["Introducing Our Newest Cabinet Collection", "A New Cabinet Collection Has Arrived"],
    captions: [
      ({ product }) =>
        `Designed for modern living.\n\nMeet ${product}—a fresh cabinet option that combines contemporary style, durable construction, and practical functionality.\n\nVisit our showroom or shop online.`,
      ({ product }) =>
        `Something new just arrived.\n\n${product} brings together a clean, current look and the everyday durability a working kitchen needs.\n\nSee it in person at our showroom or explore it online.`,
    ],
    hashtags: ["#NewCollection", "#KitchenCabinets", "#CabinetDesign", "#KitchenInspiration", "#CabinetSupplier", "#ModernKitchen"],
  },
  HOMEOWNER_INSPIRATION: {
    titles: ["Dreaming About a Kitchen Upgrade?", "Save This for Your Future Kitchen"],
    captions: [
      ({ supplied, featureSentence }) =>
        `A kitchen isn’t just where meals are made.\n\nIt’s where life happens.${supplied ? `\n\n${featureSentence}` : ""}\n\nWhether you’re planning a complete remodel or a simple refresh, the right cabinetry can completely transform the space.\n\nSave this for inspiration.`,
      ({ supplied, featureSentence }) =>
        `Thinking about what your next kitchen could look like?${supplied ? `\n\n${featureSentence}` : ""}\n\nThe right cabinets can make a room feel brighter, more functional, and much more personal—without losing the comfort that makes it feel like home.\n\nSave this idea for later.`,
    ],
    hashtags: ["#KitchenInspiration", "#DreamKitchen", "#KitchenUpgrade", "#HomeRemodel", "#CabinetDesign", "#KitchenIdeas"],
  },
  BEFORE_AFTER: {
    titles: ["Swipe to See the Transformation ➡️", "Before. After. Completely Transformed."],
    captions: [
      ({ supplied, featureSentence }) =>
        `What a difference cabinetry can make.${supplied ? `\n\n${featureSentence}` : ""}\n\nFrom outdated to modern, this project shows how thoughtful design and quality cabinets can completely change the way a kitchen looks and works.`,
      ({ supplied, featureSentence }) =>
        `Same space. A completely different experience.${supplied ? `\n\n${featureSentence}` : ""}\n\nNew cabinetry brought cleaner lines, better function, and a fresh look that feels right at home.\n\nSwipe back to see where it started.`,
    ],
    hashtags: ["#BeforeAndAfter", "#KitchenTransformation", "#KitchenRemodel", "#CabinetDesign", "#HomeRenovation", "#Remodeling"],
  },
  PROMOTION: {
    titles: ["🎉 Limited-Time Savings This Month", "Plan Ahead and Save on Your Next Kitchen"],
    captions: [
      ({ supplied, product }) =>
        `Thinking about your next kitchen project?\n\nNow is the perfect time.\n\nEnjoy special pricing on ${supplied ? product : "selected cabinet collections"} while inventory lasts.\n\nDon’t wait until your project starts—plan ahead and save.`,
      ({ supplied, product }) =>
        `A little planning now can save you later.\n\nFor a limited time, ${supplied ? product : "select cabinet collections"} are available at special pricing while supplies last.\n\nGet ahead of your next project and lock in the savings.`,
    ],
    hashtags: ["#CabinetSale", "#LimitedTimeOffer", "#KitchenProject", "#CabinetSupplier", "#KitchenRemodel", "#HoustonTX"],
  },
};

function setProgress(step) {
  progressItems.forEach((item) => {
    item.classList.toggle("active", Number(item.dataset.progress) <= step);
  });
}

function getActiveImage() {
  return imageItems.find((item) => item.id === activeImageId) || imageItems[0];
}

function classifyTemplate() {
  if (imageItems.some((item) => item.isSample)) return "PROJECT_SHOWCASE";

  const names = imageItems.map((item) => item.name.toLowerCase()).join(" ");
  const has = (...terms) => terms.some((term) => names.includes(term));

  if (has("before", "after", "transformation")) return "BEFORE_AFTER";
  if ((has("white", "shaker") && has("maple", "two-tone", "two tone")) || has("two-tone", "two tone")) {
    return "TWO_TONE_KITCHEN";
  }
  if (has("dealer", "showroom", "wholesale program")) return "DEALER";
  if (has("contractor", "builder", "jobsite")) return "CONTRACTOR";
  if (has("in stock", "inventory", "ready to go", "pickup")) return "IN_STOCK";
  if (has("new collection", "new launch", "newest")) return "NEW_COLLECTION";
  if (has("sale", "promotion", "special", "discount")) return "PROMOTION";
  if (has("inspiration", "dream", "moodboard")) return "HOMEOWNER_INSPIRATION";
  if (has("white shaker", "white_shaker", "white-shaker")) return "WHITE_SHAKER";
  if (imageItems.length > 1 || has("completed", "finished", "installed")) return "PROJECT_SHOWCASE";
  return "HOMEOWNER_INSPIRATION";
}

function getVisualProfile() {
  const isSample = imageItems.some((item) => item.isSample);
  if (isSample) {
    return {
      tags: ["Kitchen", "White Shaker cabinets", "Completed installation", "Bright neutral finish"],
      space: "kitchen",
      product: "White Shaker cabinet collection",
      status: "recently completed",
    };
  }

  const cues = imageItems.flatMap((item) => item.cues || []);
  const uniqueCues = [...new Set(cues)];
  if (imageItems.length > 1) uniqueCues.push("Multiple viewpoints");

  const tags = uniqueCues.length
    ? uniqueCues.slice(0, 4)
    : ["Visual story", "Project details", "Material contrast"];

  return {
    tags,
    space: "kitchen project",
    product: "cabinet collection shown",
    status: "recently photographed",
  };
}

function updateVisualAnalysis() {
  if (!imageItems.length) {
    analysisTitle.textContent = "Add photos to begin";
    analysisSummary.textContent = "AI will read the materials, light, color, and overall mood.";
    analysisTags.classList.add("hidden");
    analysisTags.replaceChildren();
    templateSelect.disabled = true;
    selectedTemplate = "PROJECT_SHOWCASE";
    templateSelect.value = selectedTemplate;
    return;
  }

  const profile = getVisualProfile();
  if (!templateManuallyChanged) selectedTemplate = classifyTemplate();
  templateSelect.value = selectedTemplate;
  templateSelect.disabled = false;
  analysisTitle.textContent = `${templateLabels[selectedTemplate]} detected`;
  analysisSummary.textContent = "The image selects a fixed, approved template. AI only fills verified product details.";
  analysisTags.replaceChildren(
    ...profile.tags.map((tag) => {
      const item = document.createElement("span");
      item.className = "analysis-tag";
      item.textContent = tag;
      return item;
    }),
  );
  analysisTags.classList.remove("hidden");
}

function analyzeImageItem(item) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 24;
      canvas.height = 24;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      context.drawImage(image, 0, 0, 24, 24);
      const pixels = context.getImageData(0, 0, 24, 24).data;
      let red = 0;
      let green = 0;
      let blue = 0;
      let samples = 0;

      for (let index = 0; index < pixels.length; index += 16) {
        if (pixels[index + 3] < 20) continue;
        red += pixels[index];
        green += pixels[index + 1];
        blue += pixels[index + 2];
        samples += 1;
      }

      red /= samples || 1;
      green /= samples || 1;
      blue /= samples || 1;
      const brightness = (red + green + blue) / 3;
      const spread = Math.max(red, green, blue) - Math.min(red, green, blue);
      item.cues = [
        brightness > 180 ? "Light-filled" : "Moody contrast",
        red - blue > 12 ? "Warm palette" : blue - red > 12 ? "Cool palette" : "Balanced color",
        spread < 28 ? "Soft neutrals" : "Rich color",
      ];
      resolve();
    };
    image.onerror = resolve;
    image.src = item.url;
  });
}

function renderImages() {
  const activeImage = getActiveImage();

  if (!activeImage) {
    imageInput.value = "";
    previewImage.removeAttribute("src");
    imagePreview.classList.add("hidden");
    dropzone.classList.remove("hidden");
    generatedOutput.classList.add("hidden");
    emptyOutput.classList.remove("hidden");
    generateButton.disabled = true;
    setProgress(1);
    updateVisualAnalysis();
    return;
  }

  activeImageId = activeImage.id;
  previewImage.src = activeImage.url;
  previewImage.alt = `Project photo: ${activeImage.name}`;
  fileName.textContent = activeImage.name;
  imageInsight.textContent = `${imageItems.length} photo${imageItems.length === 1 ? "" : "s"} added · Select a thumbnail to set the main photo`;
  dropzone.classList.add("hidden");
  imagePreview.classList.remove("hidden");
  generateButton.disabled = false;
  setProgress(2);
  updateVisualAnalysis();

  thumbnailStrip.replaceChildren();
  imageItems.forEach((item, index) => {
    const button = document.createElement("button");
    button.className = `thumbnail-button${item.id === activeImageId ? " active" : ""}`;
    button.type = "button";
    button.setAttribute("aria-label", `Use ${item.name} as main photo`);
    button.setAttribute("aria-pressed", String(item.id === activeImageId));
    button.dataset.imageId = item.id;
    button.title = `${index + 1}. ${item.name}`;

    const thumbnail = document.createElement("img");
    thumbnail.src = item.url;
    thumbnail.alt = "";
    button.append(thumbnail);
    thumbnailStrip.append(button);
  });

  if (imageItems.length < MAX_IMAGES) {
    const addButton = document.createElement("button");
    addButton.className = "add-photo-button";
    addButton.type = "button";
    addButton.setAttribute("aria-label", "Add more photos");
    addButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
    thumbnailStrip.append(addButton);
  }
}

function validateFile(file) {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) return "Please choose JPG, PNG, or WebP images";
  if (file.size > 10 * 1024 * 1024) return `${file.name} is larger than 10 MB`;
  return "";
}

function addFiles(fileList) {
  const remainingSlots = MAX_IMAGES - imageItems.length;
  const files = [...fileList].slice(0, remainingSlots);

  if (!files.length) {
    showToast(`You can add up to ${MAX_IMAGES} photos`);
    return;
  }

  const validFiles = files.filter((file) => {
    const error = validateFile(file);
    if (error) showToast(error);
    return !error;
  });

  const newItems = validFiles.map((file) => ({
    id: crypto.randomUUID(),
    name: file.name,
    url: URL.createObjectURL(file),
    cues: [],
  }));

  imageItems.push(...newItems);
  templateManuallyChanged = false;
  if (!activeImageId && newItems[0]) activeImageId = newItems[0].id;
  renderImages();
  Promise.all(newItems.map(analyzeImageItem)).then(updateVisualAnalysis);
  imageInput.value = "";

  if (fileList.length > remainingSlots) {
    showToast(`Added ${remainingSlots}; the limit is ${MAX_IMAGES} photos`);
  }
}

function createSampleImage(accent, detail, name) {
  const sampleSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
      <defs>
        <linearGradient id="wall" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#efe8dc"/><stop offset="1" stop-color="#d8cdbd"/>
        </linearGradient>
        <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1">
          <stop stop-color="${accent}"/><stop offset="1" stop-color="${detail}"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#wall)"/>
      <rect y="540" width="1200" height="260" fill="#b98d60"/>
      <rect x="90" y="130" width="380" height="390" rx="4" fill="#f8f5ef"/>
      <rect x="115" y="155" width="330" height="340" fill="#dce8e7"/>
      <path d="M280 155v340M115 325h330" stroke="#f8f5ef" stroke-width="18"/>
      <rect x="585" y="105" width="515" height="435" rx="8" fill="url(#wood)"/>
      <g fill="url(#wood)" stroke="#b8b4ac" stroke-width="4">
        <rect x="610" y="130" width="142" height="175"/><rect x="766" y="130" width="142" height="175"/><rect x="922" y="130" width="152" height="175"/>
        <rect x="610" y="320" width="220" height="190"/><rect x="844" y="320" width="230" height="190"/>
      </g>
      <g fill="#4e4338"><circle cx="738" cy="218" r="6"/><circle cx="780" cy="218" r="6"/><circle cx="894" cy="218" r="6"/><circle cx="936" cy="218" r="6"/></g>
      <rect x="535" y="520" width="610" height="35" rx="4" fill="#f2eee5"/>
      <rect x="270" y="565" width="600" height="150" rx="7" fill="#e5ddd0"/>
      <rect x="295" y="590" width="550" height="100" rx="4" fill="#b59167"/>
      <ellipse cx="570" cy="530" rx="72" ry="14" fill="#789073"/>
      <path d="M570 520c-38-85-56-135-20-170M570 515c15-90 62-122 80-164M565 505c-58-45-88-78-91-126" fill="none" stroke="#5e765a" stroke-width="12" stroke-linecap="round"/>
      <circle cx="550" cy="350" r="12" fill="#f0b56f"/><circle cx="650" cy="350" r="12" fill="#f0b56f"/><circle cx="474" cy="379" r="12" fill="#f0b56f"/>
    </svg>`;
  const blob = new Blob([sampleSvg], { type: "image/svg+xml" });
  return {
    id: crypto.randomUUID(),
    name,
    url: URL.createObjectURL(blob),
    isSample: true,
  };
}

function loadSample() {
  imageItems.forEach((item) => URL.revokeObjectURL(item.url));
  imageItems = [
    createSampleImage("#fbfaf6", "#e6e2da", "White Shaker kitchen.jpg"),
    createSampleImage("#f7f6f1", "#dedbd3", "White Shaker cabinet detail.jpg"),
    createSampleImage("#fffefa", "#e9e5dc", "Completed kitchen view.jpg"),
  ];
  templateManuallyChanged = false;
  activeImageId = imageItems[0].id;
  renderImages();
}

function generatePost() {
  const profile = getVisualProfile();
  const template = templateLibrary[selectedTemplate];
  const title = template.titles[variation % template.titles.length];
  const copyContext = buildProductCopy(profile);
  const captionWriter = template.captions[variation % template.captions.length];

  outputTitle.value = title;
  outputCaption.value = captionWriter({ ...profile, ...copyContext });
  outputHashtags.value = (
    currentPlatform === "Instagram" ? template.hashtags : template.hashtags.slice(0, 5)
  ).join(" ");

  updateQuality();
  emptyOutput.classList.add("hidden");
  generatedOutput.classList.remove("hidden");
  setProgress(3);

  if (window.innerWidth < 901) {
    document.querySelector("#output-panel").scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function updateQuality() {
  const captionLength = outputCaption.value.length;
  characterCount.textContent = `${captionLength} characters`;
  specificityLabel.textContent = templateLabels[selectedTemplate];
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("visible"), 2200);
}

imageInput.addEventListener("change", (event) => addFiles(event.target.files));
sampleButton.addEventListener("click", loadSample);

["dragenter", "dragover"].forEach((eventName) => {
  dropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropzone.classList.add("dragging");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  dropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropzone.classList.remove("dragging");
  });
});

dropzone.addEventListener("drop", (event) => addFiles(event.dataTransfer.files));

removeImageButton.addEventListener("click", () => {
  const activeIndex = imageItems.findIndex((item) => item.id === activeImageId);
  if (activeIndex < 0) return;

  URL.revokeObjectURL(imageItems[activeIndex].url);
  imageItems.splice(activeIndex, 1);
  activeImageId = imageItems[Math.min(activeIndex, imageItems.length - 1)]?.id || "";
  renderImages();
  showToast(imageItems.length ? "Photo removed" : "All photos removed");
});

thumbnailStrip.addEventListener("click", (event) => {
  const addButton = event.target.closest(".add-photo-button");
  if (addButton) {
    imageInput.click();
    return;
  }

  const thumbnailButton = event.target.closest(".thumbnail-button");
  if (!thumbnailButton) return;
  activeImageId = thumbnailButton.dataset.imageId;
  renderImages();
});

templateSelect.addEventListener("change", () => {
  selectedTemplate = templateSelect.value;
  templateManuallyChanged = true;
  variation = 0;
  updateVisualAnalysis();
  if (!generatedOutput.classList.contains("hidden")) generatePost();
  showToast(`${templateLabels[selectedTemplate]} template selected`);
});

productContext.addEventListener("input", () => {
  if (!generatedOutput.classList.contains("hidden")) {
    variation = 0;
    generatePost();
  }
});

postForm.addEventListener("submit", (event) => {
  event.preventDefault();
  generateButton.disabled = true;
  generateButton.querySelector("span").textContent = "Writing your draft…";
  window.setTimeout(() => {
    variation = 0;
    generatePost();
    generateButton.disabled = false;
    generateButton.querySelector("span").textContent = "Generate post";
  }, 650);
});

regenerateButton.addEventListener("click", () => {
  variation += 1;
  generatePost();
  showToast(`Another approved ${templateLabels[selectedTemplate]} version`);
});

platformTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    currentPlatform = tab.dataset.platform;
    platformTabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });
    generatePost();
  });
});

[outputCaption, outputTitle, outputHashtags].forEach((field) => {
  field.addEventListener("input", updateQuality);
});

fieldCopyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const field = document.querySelector(`#${button.dataset.copyTarget}`);
    const label = button.textContent.replace("Copy ", "");
    try {
      await navigator.clipboard.writeText(field.value);
    } catch {
      field.select();
      document.execCommand("copy");
    }
    showToast(`${label.charAt(0).toUpperCase() + label.slice(1)} copied`);
  });
});
