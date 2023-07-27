//
//  AddCardFlowSiteFactory.swift
//  MercadoPagoSDK
//
//  Created by Esteban Adrian Boffa on 16/08/2019.
//

import Foundation

struct AddCardFlowSiteFactory {

    let siteIdsSettings: [String: NSDictionary] = [
            //Argentina
            "MLA": ["language": "es", "currency": "ARS", "termsconditions": "https://www.mercadopago.com.ar/ayuda/terminos-y-condiciones_299"],
            //Brasil
            "MLB": ["language": "pt", "currency": "BRL", "termsconditions": "https://www.mercadopago.com.br/ajuda/termos-e-condicoes_300"],
            //Chile
            "MLC": ["language": "es", "currency": "CLP", "termsconditions": "https://www.mercadopago.cl/ayuda/terminos-y-condiciones_299"],
            //Mexico
            "MLM": ["language": "es-MX", "currency": "MXN", "termsconditions": "https://www.mercadopago.com.mx/ayuda/terminos-y-condiciones_715"],
            //Peru
            "MPE": ["language": "es", "currency": "PEN", "termsconditions": "https://www.mercadopago.com.pe/ayuda/terminos-condiciones-uso_2483"],
            //Uruguay
            "MLU": ["language": "es", "currency": "UYU", "termsconditions": "https://www.mercadopago.com.uy/ayuda/terminos-y-condiciones-uy_2834"],
            //Colombia
            "MCO": ["language": "es-CO", "currency": "COP", "termsconditions": "https://www.mercadopago.com.co/ayuda/terminos-y-condiciones_299"],
            //Venezuela
            "MLV": ["language": "es", "currency": "VES", "termsconditions": "https://www.mercadopago.com.ve/ayuda/terminos-y-condiciones_299"]
        ]

    func createSite(_ siteId: String) -> PXSite {
        let siteConfig = siteIdsSettings[siteId] ?? siteIdsSettings["MLA"]
        let currencyId = siteConfig?["currency"] as? String ?? "ARS"
        let termsAndConditionsUrl = ""
        return PXSite(id: siteId, currencyId: currencyId, termsAndConditionsUrl: termsAndConditionsUrl, shouldWarnAboutBankInterests: false)
    }
}
