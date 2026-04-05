"""
Train a Vision Transformer (ViT) classifier on ECG images organized with ImageFolder layout:

Dataset structure expected:
  data/
    train/
      normal/
      abnormal/
    val/
      normal/
      abnormal/

Usage (CPU/GPU aware):
  python train_vit.py --data-dir ../data --epochs 10 --batch-size 16 --lr 3e-4 --save-path backend/models/vit_ecg_model.pth

Notes:
- Requires: torch, torchvision, timm
- The script fine-tunes a ViT from timm with a linear head for binary classification.
"""
import argparse
import os
from pathlib import Path

try:
    import torch
    import torch.nn as nn
    from torch.utils.data import DataLoader
    from torchvision import datasets, transforms
    import timm
except Exception as e:
    print("Missing deep-learning dependencies. Please install: torch torchvision timm")
    raise


def get_transforms(img_size=224):
    train_t = transforms.Compose([
        transforms.Resize((img_size, img_size)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(10),
        transforms.ToTensor(),
        transforms.Normalize(mean=(0.485, 0.456, 0.406), std=(0.229, 0.224, 0.225))
    ])
    val_t = transforms.Compose([
        transforms.Resize((img_size, img_size)),
        transforms.ToTensor(),
        transforms.Normalize(mean=(0.485, 0.456, 0.406), std=(0.229, 0.224, 0.225))
    ])
    return train_t, val_t


def build_model(model_name='vit_base_patch16_224', pretrained=True, num_classes=1):
    # Create model with single-output head (sigmoid for binary)
    model = timm.create_model(model_name, pretrained=pretrained, num_classes=num_classes)
    return model


def train(args):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print('Using device:', device)

    train_t, val_t = get_transforms()

    train_dir = os.path.join(args.data_dir, 'train')
    val_dir = os.path.join(args.data_dir, 'val')

    train_ds = datasets.ImageFolder(train_dir, transform=train_t)
    val_ds = datasets.ImageFolder(val_dir, transform=val_t)

    train_loader = DataLoader(train_ds, batch_size=args.batch_size, shuffle=True, num_workers=4)
    val_loader = DataLoader(val_ds, batch_size=args.batch_size, shuffle=False, num_workers=4)

    model = build_model(pretrained=True, num_classes=1)
    model.to(device)

    criterion = nn.BCEWithLogitsLoss()
    optimizer = torch.optim.AdamW(model.parameters(), lr=args.lr)

    best_val_loss = float('inf')

    for epoch in range(1, args.epochs + 1):
        model.train()
        train_loss = 0.0
        correct = 0
        total = 0

        for images, targets in train_loader:
            images = images.to(device)
            targets = targets.float().unsqueeze(1).to(device)  # shape (B,1)

            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, targets)
            loss.backward()
            optimizer.step()

            train_loss += loss.item() * images.size(0)
            preds = (torch.sigmoid(outputs) > 0.5).long()
            correct += (preds.cpu().numpy().flatten() == targets.cpu().numpy().flatten()).sum()
            total += images.size(0)

        train_loss /= len(train_ds)
        train_acc = 100.0 * correct / total

        model.eval()
        val_loss = 0.0
        val_correct = 0
        val_total = 0
        with torch.no_grad():
            for images, targets in val_loader:
                images = images.to(device)
                targets = targets.float().unsqueeze(1).to(device)
                outputs = model(images)
                loss = criterion(outputs, targets)
                val_loss += loss.item() * images.size(0)
                preds = (torch.sigmoid(outputs) > 0.5).long()
                val_correct += (preds.cpu().numpy().flatten() == targets.cpu().numpy().flatten()).sum()
                val_total += images.size(0)
        val_loss /= len(val_ds)
        val_acc = 100.0 * val_correct / val_total

        print(f"Epoch {epoch}/{args.epochs}: Train loss {train_loss:.4f}, Train acc {train_acc:.2f}%, Val loss {val_loss:.4f}, Val acc {val_acc:.2f}%")

        # Save best model
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            save_dir = Path(args.save_path).parent
            save_dir.mkdir(parents=True, exist_ok=True)
            torch.save({'model_state_dict': model.state_dict(), 'class_to_idx': train_ds.class_to_idx}, args.save_path)
            print(f"Saved best model to {args.save_path}")


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--data-dir', type=str, default='data', help='Path to data folder with train/val subfolders')
    parser.add_argument('--epochs', type=int, default=10)
    parser.add_argument('--batch-size', type=int, default=8)
    parser.add_argument('--lr', type=float, default=3e-4)
    parser.add_argument('--save-path', type=str, default='backend/models/vit_ecg_model.pth')
    args = parser.parse_args()
    train(args)
