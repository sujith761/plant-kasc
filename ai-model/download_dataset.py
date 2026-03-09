"""
PlantVillage Dataset Download Script
Downloads the PlantVillage dataset from Kaggle for training the plant disease model.

Prerequisites:
  1. Install kagglehub: pip install kagglehub
  2. (Optional) Set KAGGLE_USERNAME and KAGGLE_KEY env vars or
     place kaggle.json in ~/.kaggle/

Usage:
  python download_dataset.py
"""

import os
import sys
import shutil


def download_with_kagglehub():
    """Download using kagglehub (recommended)"""
    try:
        import kagglehub
    except ImportError:
        print("Installing kagglehub...")
        os.system(f"{sys.executable} -m pip install kagglehub")
        import kagglehub

    print("Downloading PlantVillage dataset from Kaggle...")
    print("(This may take a while — the dataset is ~1 GB)\n")

    path = kagglehub.dataset_download("abdallahalidev/plantvillage-dataset")
    print(f"\nDataset downloaded to: {path}")
    return path


def setup_dataset_directory(source_path):
    """
    Copy/link the dataset into the expected directory structure.
    The training script expects: ai-model/dataset/PlantVillage/<class_folders>
    """
    target_dir = os.path.join(os.path.dirname(__file__), "dataset", "PlantVillage")

    # Look for the 'color' subfolder (highest quality images)
    color_dir = None
    for root, dirs, files in os.walk(source_path):
        if "color" in dirs:
            color_dir = os.path.join(root, "color")
            break
        # Some versions have segmented/color/grayscale structure
        if os.path.basename(root) == "color":
            color_dir = root
            break

    # Fallback: look for class folders directly
    if color_dir is None:
        # Check if the source directory already has class folders
        for item in os.listdir(source_path):
            if "___" in item and os.path.isdir(os.path.join(source_path, item)):
                color_dir = source_path
                break

    if color_dir is None:
        # Walk deeper to find class folders
        for root, dirs, files in os.walk(source_path):
            for d in dirs:
                if "___" in d:
                    color_dir = root
                    break
            if color_dir:
                break

    if color_dir is None:
        print(f"Could not find class folders in {source_path}")
        print("Please manually copy the dataset class folders to:")
        print(f"  {target_dir}")
        return False

    print(f"\nFound class folders in: {color_dir}")
    print(f"Setting up dataset directory: {target_dir}")

    if os.path.exists(target_dir):
        print(f"Target directory already exists. Skipping copy.")
        num_classes = len([d for d in os.listdir(target_dir) if os.path.isdir(os.path.join(target_dir, d))])
        print(f"Found {num_classes} class folders.")
        return True

    os.makedirs(os.path.dirname(target_dir), exist_ok=True)

    # Try symlink first (fast), fall back to copy
    try:
        os.symlink(color_dir, target_dir)
        print("Created symlink to dataset.")
    except (OSError, NotImplementedError):
        print("Copying dataset (this may take a few minutes)...")
        shutil.copytree(color_dir, target_dir)
        print("Dataset copied successfully.")

    # Verify
    num_classes = len([d for d in os.listdir(target_dir) if os.path.isdir(os.path.join(target_dir, d))])
    print(f"\n✓ Dataset ready with {num_classes} classes")
 
    # Show class distribution
    total_images = 0
    for cls in sorted(os.listdir(target_dir)):
        cls_path = os.path.join(target_dir, cls)
        if os.path.isdir(cls_path):
            count = len(os.listdir(cls_path))
            total_images += count
            print(f"  {cls}: {count} images")
    print(f"\nTotal images: {total_images}")
    return True


def main():
    print("=" * 60)
    print("PlantVillage Dataset Downloader")
    print("=" * 60)

    # Check if dataset already exists
    target_dir = os.path.join(os.path.dirname(__file__), "dataset", "PlantVillage")
    if os.path.exists(target_dir):
        num_classes = len([d for d in os.listdir(target_dir) if os.path.isdir(os.path.join(target_dir, d))])
        if num_classes > 0:
            print(f"\n✓ Dataset already exists at {target_dir}")
            print(f"  Found {num_classes} class folders")
            resp = input("\nRe-download? (y/N): ").strip().lower()
            if resp != "y":
                print("Using existing dataset.")
                return

    # Download
    source_path = download_with_kagglehub()

    # Setup directory structure
    setup_dataset_directory(source_path)

    print("\n" + "=" * 60)
    print("Done! You can now train the model:")
    print("  cd training")
    print("  python train_model.py")
    print("=" * 60)


if __name__ == "__main__":
    main()
