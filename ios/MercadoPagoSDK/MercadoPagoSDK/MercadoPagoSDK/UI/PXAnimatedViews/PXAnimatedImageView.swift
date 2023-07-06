//
//  PXAnimatedImageView.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 16/8/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import UIKit

final class PXAnimatedImageView: UIView, PXAnimatedViewProtocol {
    let imageView: UIImageView
    let image: UIImage?
    let size: CGSize

    init(image: UIImage?, size: CGSize) {
        self.image = image
        self.imageView = UIImageView(frame: CGRect(x: 0, y: 0, width: 0, height: 0))
        self.imageView.translatesAutoresizingMaskIntoConstraints = false
        self.size = size
        super.init(frame: CGRect(x: 0, y: 0, width: 0, height: 0))
        PXLayout.setHeight(owner: self, height: size.height).isActive = true
        PXLayout.setWidth(owner: self, width: size.width).isActive = true
        self.layoutIfNeeded()
    }

    required public init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    func animate(duration: Double = 0.8) {
        self.addSubview(imageView)
        PXLayout.centerVertically(view: imageView).isActive = true
        PXLayout.centerHorizontally(view: imageView).isActive = true
        self.imageView.image = self.image

        PXLayout.setHeight(owner: imageView, height: size.height).isActive = true
        PXLayout.setWidth(owner: imageView, width: size.width).isActive = true

        let transitionAnimator = UIViewPropertyAnimator(duration: duration, dampingRatio: 1, animations: {
            self.imageView.layoutIfNeeded()
        })
        transitionAnimator.startAnimation()
    }
}
