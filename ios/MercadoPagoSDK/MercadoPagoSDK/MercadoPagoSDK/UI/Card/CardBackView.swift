//
//  CardBackView.swift
//  MercadoPagoSDK
//
//  Created by Demian Tejo on 1/20/16.
//  Copyright © 2016 MercadoPago. All rights reserved.
//

import Foundation
import UIKit

@IBDesignable internal class CardBackView: UIView {
    var view: UIView!

    @IBOutlet weak var cardCVV: PXMonospaceLabel!

    override init(frame: CGRect) {
        super.init(frame: frame)
        loadViewFromNib()
    }

    required public init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        loadViewFromNib()
    }

    func loadViewFromNib() {
        let bundle = Bundle(for: type(of: self))
        let nib = UINib(nibName: "CardBackView", bundle: bundle)
        if let view = nib.instantiate(withOwner: self, options: nil)[0] as? UIView {
            view.frame = bounds
            view.autoresizingMask = [.flexibleWidth, .flexibleHeight]
            self.addSubview(view)
        }
        cardCVV.numberOfLines = 0
        cardCVV.font = UIFont.systemFont(ofSize: cardCVV.font.pointSize)
    }
}
