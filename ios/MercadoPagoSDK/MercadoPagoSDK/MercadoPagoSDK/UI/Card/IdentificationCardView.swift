//
//  IdentificationCardView.swift
//  MercadoPagoSDK
//
//  Created by Demian Tejo on 5/2/16.
//  Copyright © 2016 MercadoPago. All rights reserved.
//

import UIKit

internal class IdentificationCardView: UIView, Updatable {
    var view: UIView!
    @IBOutlet weak var tipoDeDocumentoLabel: UILabel!
    @IBOutlet weak var numberDocLabel: UILabel!

    override init(frame: CGRect) {
        super.init(frame: frame)
        loadViewFromNib()
    }

    required public init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)

        loadViewFromNib()
    }

    func updateCard(token: PXCardInformationForm?, paymentMethod: PXPaymentMethod) {

    }

    func setCornerRadius(radius: CGFloat) {
        self.layer.cornerRadius = radius
    }

    func loadViewFromNib() {
        let bundle = Bundle(for: type(of: self))
        let nib = UINib(nibName: "IdentificationCardView", bundle: bundle)
        if let view = nib.instantiate(withOwner: self, options: nil)[0] as? UIView {
            view.frame = bounds
            self.addSubview(view)
        }
    }
}
