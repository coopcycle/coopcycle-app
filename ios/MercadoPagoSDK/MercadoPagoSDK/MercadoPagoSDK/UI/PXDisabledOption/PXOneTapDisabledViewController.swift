//
//  PXOneTapDisabledViewController.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 04/12/2019.
//

import UIKit

class PXOneTapDisabledViewController: UIViewController {

    init(text: String) {
        super.init(nibName: nil, bundle: nil)

        let description = UILabel()
        description.text = text
        view.addSubview(description)
        description.font = Utils.getFont(size: PXLayout.XS_FONT)
        description.textColor = ThemeManager.shared.labelTintColor()
        description.textAlignment = .center
        description.numberOfLines = 0
        PXLayout.setHeight(owner: description, height: 150).isActive = true
        PXLayout.pinTop(view: description, withMargin: PXLayout.M_MARGIN).isActive = true
        PXLayout.pinLeft(view: description, to: view, withMargin: PXLayout.S_MARGIN).isActive = true
        PXLayout.pinRight(view: description, to: view, withMargin: PXLayout.S_MARGIN).isActive = true
        PXLayout.pinBottom(view: description, withMargin: PXLayout.M_MARGIN).isActive = true
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

