//
//  DisclaimerView.swift
//  MercadoPagoSDK
//
//  Created by Demian Tejo on 9/11/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import UIKit

final class DisclaimerView: UIView, PXComponent {

    fileprivate let VERTICAL_MARGIN: CGFloat = 2.0
    fileprivate let HORIZONTAL_MARGIN: CGFloat = 24.0
    static private let FONT_SIZE: CGFloat = PXLayout.XXS_FONT

    private var textColor: CGColor!
    var disclaimerLabel: UILabel!

    public init(frame: CGRect, disclaimerText: String, colorText: UIColor = UIColor.px_grayDark(), disclaimerFontSize: CGFloat = FONT_SIZE) {
        super.init(frame: frame)
        disclaimerLabel = UILabel(frame: CGRect(x: HORIZONTAL_MARGIN, y: VERTICAL_MARGIN, width: frame.size.width - 2 * HORIZONTAL_MARGIN, height: frame.size.height - 2 * VERTICAL_MARGIN))
        disclaimerLabel.textAlignment = .center
        disclaimerLabel.textColor = colorText
        disclaimerLabel.font = Utils.getFont(size: disclaimerFontSize)
        disclaimerLabel.text = disclaimerText
        self.addSubview(disclaimerLabel)
    }

    required init?(coder aDecoder: NSCoder) {
            fatalError("init(coder:) has not been implemented")
    }
}

extension DisclaimerView {

    func getHeight() -> CGFloat {
        return self.disclaimerLabel.requiredHeight() + 2 * VERTICAL_MARGIN
    }
    func getWeight() -> CGFloat {
        return self.frame.size.width
    }
    func adjustViewFrames() {
        let frameDisclaimer = self.disclaimerLabel.frame
        self.disclaimerLabel.frame = CGRect(x: frameDisclaimer.origin.x, y: frameDisclaimer.origin.y, width: frameDisclaimer.size.width, height: self.disclaimerLabel.requiredHeight())
    }
}
