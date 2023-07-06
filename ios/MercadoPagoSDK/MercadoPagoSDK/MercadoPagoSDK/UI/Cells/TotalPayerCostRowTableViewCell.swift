//
//  TotalPayerCostRowTableViewCell.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 2/1/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import UIKit

class TotalPayerCostRowTableViewCell: UITableViewCell {

    @IBOutlet weak var totalLabel: UILabel!

    override func awakeFromNib() {
        super.awakeFromNib()
        self.selectionStyle = .none
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    public func fillCell(total: Double) {
        let currency = SiteManager.shared.getCurrency()
        // amount currency color fontsize centfontsize baselineoffset
        // (total, currency: currency, color : UIColor.black, fontSize: 16, centsFontSize: 12,  baselineOffset:3)
        let attributedTotal = NSMutableAttributedString(attributedString: NSAttributedString(string: "Total".localized + ": ", attributes: [NSAttributedString.Key.foregroundColor: UIColor.black]))
        attributedTotal.append(Utils.getAttributedAmount(total, currency: currency, color: UIColor.black, fontSize: 16, centsFontSize: 12, baselineOffset: 3))
        totalLabel.attributedText = attributedTotal
    }

    func addSeparatorLineToBottom(width: Double, height: Double) {
        let lineFrame = CGRect(origin: CGPoint(x: 0, y: Int(height)), size: CGSize(width: width, height: 0.5))
        let line = UIView(frame: lineFrame)
        line.alpha = 0.6
        line.backgroundColor = UIColor.px_grayLight()
        addSubview(line)
    }

}
