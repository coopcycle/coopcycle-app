//
//  BoletoComponent.swift
//  MercadoPagoSDK
//
//  Created by Demian Tejo on 9/27/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import UIKit

enum BoletoType: String {
    case cpf = "CPF"
    case cnpj = "CNPJ"
}

class BoletoComponent: UIView, PXComponent {
    static let IMAGE_WIDTH: CGFloat = 242.0
    static let IMAGE_HEIGHT: CGFloat = 143.0
    var boletoView: UIView!

    var typeName: UILabel!
    var numberTF: UITextField!
    var nameTF: UITextField!
    var boletoType: BoletoType {
        didSet {
            updateBoletoType()
        }
    }

    init(frame: CGRect, boletoType: BoletoType) {
        self.boletoType = boletoType
        super.init(frame: frame)
        self.setupView()
    }
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    func getHeight() -> CGFloat {
        return self.frame.size.height
    }
    func getWeight() -> CGFloat {
        return self.frame.size.width
    }

    func setupView() {
        let boletoImageView = UIImageView(frame: CGRect(x: 0, y: 0, width: BoletoComponent.IMAGE_WIDTH, height: BoletoComponent.IMAGE_HEIGHT))
        boletoImageView.image = ResourceManager.shared.getImage("boleto")
        self.boletoView = UIView(frame: CGRect(x: getImageX(), y: getImageY(), width: BoletoComponent.IMAGE_WIDTH, height: BoletoComponent.IMAGE_HEIGHT))
        self.boletoView.addSubview(boletoImageView)
        let titleLabel = UILabel(frame: CGRect(x: 5, y: 15, width: BoletoComponent.IMAGE_WIDTH - 2 * 5, height: 14))
        titleLabel.text = "DADOS PARA VALIDAR O SEU PAGAMENTO".localized
        titleLabel.textAlignment = .center
        titleLabel.font = Utils.getFont(size: 10.0)
        titleLabel.textColor = UIColor.px_grayDark()

        self.typeName = UILabel(frame: CGRect(x: 16, y: 57, width: 40, height: 14))
        typeName.textAlignment = .left
        typeName.font = Utils.getFont(size: 13.0)
        typeName.textColor = UIColor.px_grayDark()

        self.numberTF = UITextField(frame: CGRect(x: 60, y: 57, width: BoletoComponent.IMAGE_WIDTH - 48 - 5, height: 14))
        self.numberTF.textAlignment = .left
        self.numberTF.font = Utils.getFont(size: 13.0)
        self.numberTF.textColor = UIColor.px_grayDark()
        self.numberTF.placeholder = "**** ***** ***** *****"
        self.numberTF.isEnabled = false

        self.nameTF = UITextField(frame: CGRect(x: 16, y: 81, width: BoletoComponent.IMAGE_WIDTH - 2 * 16, height: 14))
        self.nameTF.textAlignment = .left
        self.nameTF.font = Utils.getFont(size: 13.0)
        self.nameTF.textColor = UIColor.px_grayDark()
        self.nameTF.placeholder = "payer_info_placeholder_cpf".localized
        self.nameTF.isEnabled = false

        self.boletoView.addSubview(titleLabel)
        self.boletoView.addSubview(self.numberTF)
        self.boletoView.addSubview(self.nameTF)
        self.boletoView.addSubview(self.typeName)
        self.addSubview(self.boletoView)

        updateBoletoType()
    }

    func updateBoletoType() {
        switch self.boletoType {
        case BoletoType.cpf:
            self.setNamePlaceholder(text: "payer_info_placeholder_cpf".localized)
        case BoletoType.cnpj:
            self.setNamePlaceholder(text: "payer_info_placeholder_cnpj".localized)
        }
    }

    func setType(text: String?) {
        self.typeName.text = text
    }
    func setNumber(text: String?) {
        self.numberTF.text = text
    }
    func setNumberPlaceHolder(text: String?) {
        self.numberTF.placeholder = text
    }
    func setName(text: String?) {
        self.nameTF.text = text
    }
    func setNamePlaceholder(text: String?) {
        self.nameTF.placeholder = text
    }

    public func updateView() {
        self.boletoView.frame = CGRect(x: getImageX(), y: getImageY(), width: BoletoComponent.IMAGE_WIDTH, height: BoletoComponent.IMAGE_HEIGHT)
    }
    func getImageX() -> CGFloat {
        return (self.getWeight() - BoletoComponent.IMAGE_WIDTH) / 2
    }
    func getImageY() -> CGFloat {
        return (self.getHeight() - BoletoComponent.IMAGE_HEIGHT) / 2
    }
}
