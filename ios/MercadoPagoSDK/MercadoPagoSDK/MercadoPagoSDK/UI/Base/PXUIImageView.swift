//
//  PXUIImageView.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 11/5/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import UIKit

class PXUIImageView: UIImageView {
    private var currentImage: UIImage?
    private var fadeInEnabled = false
    override var image: UIImage? {
        set {
            loadImage(image: newValue)
        }
        get {
            return currentImage
        }
    }

    override init(frame: CGRect) {
        super.init(frame: frame)
        self.contentMode = .scaleAspectFit
    }

    override init(image: UIImage?) {
        super.init(image: image)
        self.contentMode = .scaleAspectFit
    }

    override init(image: UIImage?, highlightedImage: UIImage?) {
        super.init(image: image, highlightedImage: highlightedImage)
        self.contentMode = .scaleAspectFit
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    private func loadImage(image: UIImage?) {
        if let pxImage = image as? PXUIImage {
            let placeholder = buildPlaceholderView(image: pxImage)
            let fallback = buildFallbackView(image: pxImage)
            Utils().loadImageFromURLWithCache(withUrl: pxImage.url, targetView: self, placeholderView: placeholder, fallbackView: fallback, fadeInEnabled: fadeInEnabled) { [weak self] newImage in
                self?.currentImage = newImage
            }
        } else {
            self.currentImage = image
        }
    }

    private func buildPlaceholderView(image: PXUIImage) -> UIView? {
        if let placeholderString = image.placeholder {
            return buildLabel(with: placeholderString)
        } else {
            return buildEmptyView()
        }
    }

    private func buildFallbackView(image: PXUIImage) -> UIView? {
        if let fallbackString = image.fallback {
            return buildLabel(with: fallbackString)
        } else {
            return buildEmptyView()
        }
    }

    private func buildEmptyView() -> UIView {
        let view = UIView(frame: CGRect(x: 0, y: 0, width: 0, height: 0))
        view.translatesAutoresizingMaskIntoConstraints = false
        view.backgroundColor = .white
        view.alpha = 0.2
        return view
    }

    private func buildLabel(with text: String?) -> UILabel? {
        let label = UILabel()
        label.translatesAutoresizingMaskIntoConstraints = false
        label.font = Utils.getFont(size: PXLayout.XS_FONT)
        label.textColor = ThemeManager.shared.labelTintColor()
        label.numberOfLines = 2
        label.lineBreakMode = .byTruncatingTail
        label.textAlignment = .center
        label.text = text
        return label
    }

    func enableFadeIn() {
        fadeInEnabled = true
    }

    func disableFadeIn() {
        fadeInEnabled = false
    }
}
