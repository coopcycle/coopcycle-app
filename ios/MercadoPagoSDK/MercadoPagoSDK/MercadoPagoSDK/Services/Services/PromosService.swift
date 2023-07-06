//
//  PromosService.swift
//  MercadoPagoSDK
//
//  Created by Matias Gualino on 22/5/15.
//  Copyright (c) 2015 MercadoPago. All rights reserved.
//

import Foundation

internal class PromosService: MercadoPagoService {

	internal func getPromos(_ url: String = PXServicesURLConfigs.MP_PROMOS_URI, public_key: String, success: @escaping (_ data: Data?) -> Void, failure: ((_ error: PXError) -> Void)?) {
        self.request(uri: url, params: "public_key=" + public_key, body: nil, method: HTTPMethod.get, success: success, failure: { (_) in
            failure?(PXError(domain: ApiDomain.GET_PROMOS, code: ErrorTypes.NO_INTERNET_ERROR, userInfo: [NSLocalizedDescriptionKey: "Hubo un error", NSLocalizedFailureReasonErrorKey: "Verifique su conexión a internet e intente nuevamente"]))
        })
	}
}
