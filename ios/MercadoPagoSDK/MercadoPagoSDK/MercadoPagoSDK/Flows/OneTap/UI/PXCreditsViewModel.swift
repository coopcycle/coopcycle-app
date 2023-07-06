//
//  PXCreditsViewModel.swift
//  MercadoPagoSDK
//
//  Created by Esteban Adrian Boffa on 10/07/2019.
//

import Foundation

struct PXCreditsViewModel {

    let displayInfo: PXDisplayInfoDto

    init(_ withModel: PXOneTapCreditsDto) {
        self.displayInfo = withModel.displayInfo
    }
}

extension PXCreditsViewModel {
    func getCardColors() -> [CGColor] {
        let defaultColor: CGColor = UIColor.gray.cgColor
        guard let gradients = displayInfo.gradientColors else { return [defaultColor, defaultColor] }
        var arrayColors: [CGColor] = [CGColor]()
        for color in gradients {
            arrayColors.append(color.hexToUIColor().cgColor)
        }
        return arrayColors
    }
}
