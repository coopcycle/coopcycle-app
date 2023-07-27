//
//  CardTypeTableViewCell.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 10/18/16.
//  Copyright © 2016 MercadoPago. All rights reserved.
//

import UIKit

class CardTypeTableViewCell: UITableViewCell {

    @IBOutlet weak var cardTypeLable: UILabel!
    var paymentMethod: PXPaymentMethod!

    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }
    func setText(text: String) {
        cardTypeLable.text = text
    }
    func setPaymentMethod(paymentMethod: PXPaymentMethod) {
        self.paymentMethod = paymentMethod
        fillCell()
    }
    func getPaymentMethod() -> PXPaymentMethod {
        return self.paymentMethod
    }
    func fillCell() {
        if paymentMethod.paymentTypeId == "credit_card"{
            cardTypeLable.text = "Crédito".localized
        } else {
            cardTypeLable.text = "Débito".localized
        }
    }
    func addSeparatorLineToBottom(width: Double, height: Double) {
        let lineFrame = CGRect(origin: CGPoint(x: 0, y: Int(height)), size: CGSize(width: width, height: 0.5))
        let line = UIView(frame: lineFrame)
        line.alpha = 0.6
        line.backgroundColor = UIColor.px_grayLight()
        addSubview(line)
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

}
