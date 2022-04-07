export const REGULATIONS_MOCK_DATA = {
    "end_user": [
        {
            "name": "Business",
            "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/EndUserTypes/business",
            "fields": [
                "business_name",
                "business_description",
                "first_name",
                "last_name",
                "birth_date"
            ],
            "detailed_fields": [
                {
                    "machine_name": "business_name",
                    "friendly_name": "Business Name"
                },
                {
                    "machine_name": "business_description",
                    "friendly_name": "Business Description"
                },
                {
                    "machine_name": "first_name",
                    "friendly_name": "First Name"
                },
                {
                    "machine_name": "last_name",
                    "friendly_name": "Last Name"
                },
                {
                    "machine_name": "birth_date",
                    "friendly_name": "Birth Date"
                }
            ],
            "type": "business",
            "requirement_name": "business_info"
        }
    ],
    "supporting_document": [
        [
            {
                "description": "",
                "type": "document",
                "name": "Business Name",
                "accepted_documents": [
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/corporate_registry",
                        "fields": [
                            "business_name"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "business_name",
                                "friendly_name": "Business Name"
                            }
                        ],
                        "type": "corporate_registry",
                        "name": "Corporate registry or foreign equivalent"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/company_seal_certificate",
                        "fields": [
                            "business_name"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "business_name",
                                "friendly_name": "Business Name"
                            }
                        ],
                        "type": "company_seal_certificate",
                        "name": "Company seal certificate or foreign equivalent"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/government_issued_document",
                        "fields": [
                            "business_name"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "business_name",
                                "friendly_name": "Business Name"
                            }
                        ],
                        "type": "government_issued_document",
                        "name": "Any other document issued by a governmental authority with the company's name and address"
                    }
                ],
                "requirement_name": "business_name_info"
            },
            {
                "description": "Must be within locality or region covered by the phone number's prefix; a PO Box is not acceptable where a local address is required.",
                "type": "document",
                "name": "Business Address (Proof of Address)",
                "accepted_documents": [
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/corporate_registry",
                        "fields": [
                            "address_sids"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "address_sids",
                                "friendly_name": "Address sid(s)"
                            }
                        ],
                        "type": "corporate_registry",
                        "name": "Corporate registry or foreign equivalent"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/company_seal_certificate",
                        "fields": [
                            "address_sids"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "address_sids",
                                "friendly_name": "Address sid(s)"
                            }
                        ],
                        "type": "company_seal_certificate",
                        "name": "Company seal certificate or foreign equivalent"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/government_issued_document",
                        "fields": [
                            "address_sids"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "address_sids",
                                "friendly_name": "Address sid(s)"
                            }
                        ],
                        "type": "government_issued_document",
                        "name": "Any other document issued by a governmental authority with the company's name and address"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/tax_document",
                        "fields": [
                            "address_sids"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "address_sids",
                                "friendly_name": "Address sid(s)"
                            }
                        ],
                        "type": "tax_document",
                        "name": "Certificate of tax payment"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/utility_bill",
                        "fields": [
                            "address_sids"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "address_sids",
                                "friendly_name": "Address sid(s)"
                            }
                        ],
                        "type": "utility_bill",
                        "name": "Utility bill"
                    }
                ],
                "requirement_name": "business_address_proof_info"
            },
            {
                "description": "",
                "type": "document",
                "name": "Business Description",
                "accepted_documents": [
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/corporate_registry",
                        "fields": [
                            "business_description"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "business_description",
                                "friendly_name": "Business Description"
                            }
                        ],
                        "type": "corporate_registry",
                        "name": "Corporate registry or Articles of Incorporation"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/government_issued_document",
                        "fields": [
                            "business_description"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "business_description",
                                "friendly_name": "Business Description"
                            }
                        ],
                        "type": "government_issued_document",
                        "name": "Other government-issued document with a business description"
                    }
                ],
                "requirement_name": "business_desc_info"
            },
            {
                "description": "",
                "type": "document",
                "name": "Name of Authorized Representative or Person in Charge of the Contract",
                "accepted_documents": [
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/drivers_license",
                        "fields": [
                            "first_name",
                            "last_name"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "first_name",
                                "friendly_name": "First Name"
                            },
                            {
                                "machine_name": "last_name",
                                "friendly_name": "Last Name"
                            }
                        ],
                        "type": "drivers_license",
                        "name": "Driver's license"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/certificate_driving_record",
                        "fields": [
                            "first_name",
                            "last_name"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "first_name",
                                "friendly_name": "First Name"
                            },
                            {
                                "machine_name": "last_name",
                                "friendly_name": "Last Name"
                            }
                        ],
                        "type": "certificate_driving_record",
                        "name": "Certificate of driving record"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/health_insurance_certificate",
                        "fields": [
                            "first_name",
                            "last_name"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "first_name",
                                "friendly_name": "First Name"
                            },
                            {
                                "machine_name": "last_name",
                                "friendly_name": "Last Name"
                            }
                        ],
                        "type": "health_insurance_certificate",
                        "name": "Health insurance certificate"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/maternity_passbook",
                        "fields": [
                            "first_name",
                            "last_name"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "first_name",
                                "friendly_name": "First Name"
                            },
                            {
                                "machine_name": "last_name",
                                "friendly_name": "Last Name"
                            }
                        ],
                        "type": "maternity_passbook",
                        "name": "Maternity passbook"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/passport",
                        "fields": [
                            "first_name",
                            "last_name"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "first_name",
                                "friendly_name": "First Name"
                            },
                            {
                                "machine_name": "last_name",
                                "friendly_name": "Last Name"
                            }
                        ],
                        "type": "passport",
                        "name": "Passport"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/residence_permit",
                        "fields": [
                            "first_name",
                            "last_name"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "first_name",
                                "friendly_name": "First Name"
                            },
                            {
                                "machine_name": "last_name",
                                "friendly_name": "Last Name"
                            }
                        ],
                        "type": "residence_permit",
                        "name": "Resident card"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/certificate_special_permanent_resident",
                        "fields": [
                            "first_name",
                            "last_name"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "first_name",
                                "friendly_name": "First Name"
                            },
                            {
                                "machine_name": "last_name",
                                "friendly_name": "Last Name"
                            }
                        ],
                        "type": "certificate_special_permanent_resident",
                        "name": "Certificate of special permanent resident"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/seal_certificate_call_transfer_service_agreement",
                        "fields": [
                            "first_name",
                            "last_name"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "first_name",
                                "friendly_name": "First Name"
                            },
                            {
                                "machine_name": "last_name",
                                "friendly_name": "Last Name"
                            }
                        ],
                        "type": "seal_certificate_call_transfer_service_agreement",
                        "name": "Seal certificate of the seal to be used to conclude the call transfer service agreement"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/government_issued_document",
                        "fields": [
                            "first_name",
                            "last_name"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "first_name",
                                "friendly_name": "First Name"
                            },
                            {
                                "machine_name": "last_name",
                                "friendly_name": "Last Name"
                            }
                        ],
                        "type": "government_issued_document",
                        "name": "Any other photo ID issued by a governmental authority with the individual's name, address, and date of birth"
                    }
                ],
                "requirement_name": "name_of_auth_rep_info"
            },
            {
                "description": "\"My Number\" should be redacted from identity documentation prior to submission (if applicable)",
                "type": "document",
                "name": "Date of Birth of Authorized Representative or Person in Charge of the Contract",
                "accepted_documents": [
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/drivers_license",
                        "fields": [
                            "birth_date"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "birth_date",
                                "friendly_name": "Birth Date"
                            }
                        ],
                        "type": "drivers_license",
                        "name": "Driver's license"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/certificate_driving_record",
                        "fields": [
                            "birth_date"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "birth_date",
                                "friendly_name": "Birth Date"
                            }
                        ],
                        "type": "certificate_driving_record",
                        "name": "Certificate of driving record"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/health_insurance_certificate",
                        "fields": [
                            "birth_date"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "birth_date",
                                "friendly_name": "Birth Date"
                            }
                        ],
                        "type": "health_insurance_certificate",
                        "name": "Health insurance certificate"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/maternity_passbook",
                        "fields": [
                            "birth_date"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "birth_date",
                                "friendly_name": "Birth Date"
                            }
                        ],
                        "type": "maternity_passbook",
                        "name": "Maternity passbook"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/passport",
                        "fields": [
                            "birth_date"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "birth_date",
                                "friendly_name": "Birth Date"
                            }
                        ],
                        "type": "passport",
                        "name": "Passport"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/residence_permit",
                        "fields": [
                            "birth_date"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "birth_date",
                                "friendly_name": "Birth Date"
                            }
                        ],
                        "type": "residence_permit",
                        "name": "Resident card"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/certificate_special_permanent_resident",
                        "fields": [
                            "birth_date"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "birth_date",
                                "friendly_name": "Birth Date"
                            }
                        ],
                        "type": "certificate_special_permanent_resident",
                        "name": "Certificate of special permanent resident"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/seal_certificate_call_transfer_service_agreement",
                        "fields": [
                            "birth_date"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "birth_date",
                                "friendly_name": "Birth Date"
                            }
                        ],
                        "type": "seal_certificate_call_transfer_service_agreement",
                        "name": "Seal certificate of the seal to be used to conclude the call transfer service agreement"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/government_issued_document",
                        "fields": [
                            "birth_date"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "birth_date",
                                "friendly_name": "Birth Date"
                            }
                        ],
                        "type": "government_issued_document",
                        "name": "Any other photo ID issued by a governmental authority with the individual's name, address, and date of birth"
                    }
                ],
                "requirement_name": "birth_date_of_auth_rep_info"
            },
            {
                "description": "",
                "type": "document",
                "name": "Address of Authorized Representative or Person in Charge of the Contract (Proof of Address)",
                "accepted_documents": [
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/drivers_license",
                        "fields": [
                            "address_sids"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "address_sids",
                                "friendly_name": "Address sid(s)"
                            }
                        ],
                        "type": "drivers_license",
                        "name": "Driver's license"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/certificate_driving_record",
                        "fields": [
                            "address_sids"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "address_sids",
                                "friendly_name": "Address sid(s)"
                            }
                        ],
                        "type": "certificate_driving_record",
                        "name": "Certificate of driving record"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/health_insurance_certificate",
                        "fields": [
                            "address_sids"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "address_sids",
                                "friendly_name": "Address sid(s)"
                            }
                        ],
                        "type": "health_insurance_certificate",
                        "name": "Health insurance certificate"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/maternity_passbook",
                        "fields": [
                            "address_sids"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "address_sids",
                                "friendly_name": "Address sid(s)"
                            }
                        ],
                        "type": "maternity_passbook",
                        "name": "Maternity passbook"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/passport",
                        "fields": [
                            "address_sids"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "address_sids",
                                "friendly_name": "Address sid(s)"
                            }
                        ],
                        "type": "passport",
                        "name": "Passport"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/residence_permit",
                        "fields": [
                            "address_sids"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "address_sids",
                                "friendly_name": "Address sid(s)"
                            }
                        ],
                        "type": "residence_permit",
                        "name": "Resident card"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/certificate_special_permanent_resident",
                        "fields": [
                            "address_sids"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "address_sids",
                                "friendly_name": "Address sid(s)"
                            }
                        ],
                        "type": "certificate_special_permanent_resident",
                        "name": "Certificate of special permanent resident"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/seal_certificate_call_transfer_service_agreement",
                        "fields": [
                            "address_sids"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "address_sids",
                                "friendly_name": "Address sid(s)"
                            }
                        ],
                        "type": "seal_certificate_call_transfer_service_agreement",
                        "name": "Seal certificate of the seal to be used to conclude the call transfer service agreement"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/government_issued_document",
                        "fields": [
                            "address_sids"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "address_sids",
                                "friendly_name": "Address sid(s)"
                            }
                        ],
                        "type": "government_issued_document",
                        "name": "Any other photo ID issued by a governmental authority with the individual's name, address, and date of birth"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/tax_document",
                        "fields": [
                            "address_sids"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "address_sids",
                                "friendly_name": "Address sid(s)"
                            }
                        ],
                        "type": "tax_document",
                        "name": "Certificate of tax payment"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/utility_bill",
                        "fields": [
                            "address_sids"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "address_sids",
                                "friendly_name": "Address sid(s)"
                            }
                        ],
                        "type": "utility_bill",
                        "name": "Utility bill"
                    }
                ],
                "requirement_name": "address_of_auth_rep_proof_info"
            },
            {
                "description": "Proof that representative is authorized to act on behalf of the business",
                "type": "document",
                "name": "Authorization of Representative or Person in Charge of the Contract",
                "accepted_documents": [
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/power_of_attorney",
                        "fields": [],
                        "detailed_fields": [],
                        "type": "power_of_attorney",
                        "name": "Power of attorney"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/company_by_laws",
                        "fields": [
                            "first_name",
                            "last_name"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "first_name",
                                "friendly_name": "First Name"
                            },
                            {
                                "machine_name": "last_name",
                                "friendly_name": "Last Name"
                            }
                        ],
                        "type": "company_by_laws",
                        "name": "Copy of Company By-Laws showing the Authorized Person or Person in Charge of Contract is duly authorized to execute contract"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/letter_of_authorization",
                        "fields": [
                            "first_name",
                            "last_name"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "first_name",
                                "friendly_name": "First Name"
                            },
                            {
                                "machine_name": "last_name",
                                "friendly_name": "Last Name"
                            }
                        ],
                        "type": "letter_of_authorization",
                        "name": "Letter on the company letterhead under seal showing the Authorized Person or Person in Charge of Contract is duly authorized to execute contract"
                    }
                ],
                "requirement_name": "auth_of_rep_info"
            }
        ],
        [
            {
                "description": "",
                "type": "document",
                "name": "Business Name",
                "accepted_documents": [
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/corporate_registry",
                        "fields": [
                            "business_name"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "business_name",
                                "friendly_name": "Business Name"
                            }
                        ],
                        "type": "corporate_registry",
                        "name": "Corporate registry or foreign equivalent"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/company_seal_certificate",
                        "fields": [
                            "business_name"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "business_name",
                                "friendly_name": "Business Name"
                            }
                        ],
                        "type": "company_seal_certificate",
                        "name": "Company seal certificate or foreign equivalent"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/government_issued_document",
                        "fields": [
                            "business_name"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "business_name",
                                "friendly_name": "Business Name"
                            }
                        ],
                        "type": "government_issued_document",
                        "name": "Any other document issued by a governmental authority with the company's name and address"
                    }
                ],
                "requirement_name": "business_name_info"
            },
            {
                "description": "Must be within locality or region covered by the phone number's prefix; a PO Box is not acceptable where a local address is required.",
                "type": "document",
                "name": "Business Address (Proof of Address)",
                "accepted_documents": [
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/corporate_registry",
                        "fields": [
                            "address_sids"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "address_sids",
                                "friendly_name": "Address sid(s)"
                            }
                        ],
                        "type": "corporate_registry",
                        "name": "Corporate registry or foreign equivalent"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/company_seal_certificate",
                        "fields": [
                            "address_sids"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "address_sids",
                                "friendly_name": "Address sid(s)"
                            }
                        ],
                        "type": "company_seal_certificate",
                        "name": "Company seal certificate or foreign equivalent"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/government_issued_document",
                        "fields": [
                            "address_sids"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "address_sids",
                                "friendly_name": "Address sid(s)"
                            }
                        ],
                        "type": "government_issued_document",
                        "name": "Any other document issued by a governmental authority with the company's name and address"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/tax_document",
                        "fields": [
                            "address_sids"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "address_sids",
                                "friendly_name": "Address sid(s)"
                            }
                        ],
                        "type": "tax_document",
                        "name": "Certificate of tax payment"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/utility_bill",
                        "fields": [
                            "address_sids"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "address_sids",
                                "friendly_name": "Address sid(s)"
                            }
                        ],
                        "type": "utility_bill",
                        "name": "Utility bill"
                    }
                ],
                "requirement_name": "business_address_proof_info"
            },
            {
                "description": "",
                "type": "document",
                "name": "Business Description",
                "accepted_documents": [
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/corporate_registry",
                        "fields": [
                            "business_description"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "business_description",
                                "friendly_name": "Business Description"
                            }
                        ],
                        "type": "corporate_registry",
                        "name": "Corporate registry or Articles of Incorporation"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/government_issued_document",
                        "fields": [
                            "business_description"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "business_description",
                                "friendly_name": "Business Description"
                            }
                        ],
                        "type": "government_issued_document",
                        "name": "Other government-issued document with a business description"
                    }
                ],
                "requirement_name": "business_desc_info"
            },
            {
                "description": "If applicable",
                "type": "document",
                "name": "Beneficial ownership and identity (applicable for any person or entity that owns 25% or more shares of voting rights)",
                "accepted_documents": [
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/shareholders_registry",
                        "fields": [],
                        "detailed_fields": [],
                        "type": "shareholders_registry",
                        "name": "Shareholders' registry or equivalent document that includes shareholder information"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/annual_securities_report",
                        "fields": [
                            "business_name",
                            "first_name",
                            "last_name"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "business_name",
                                "friendly_name": "Business Name"
                            },
                            {
                                "machine_name": "first_name",
                                "friendly_name": "First Name"
                            },
                            {
                                "machine_name": "last_name",
                                "friendly_name": "Last Name"
                            }
                        ],
                        "type": "annual_securities_report",
                        "name": "Annual securities report"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/corporate_registry",
                        "fields": [
                            "business_name",
                            "first_name",
                            "last_name"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "business_name",
                                "friendly_name": "Business Name"
                            },
                            {
                                "machine_name": "first_name",
                                "friendly_name": "First Name"
                            },
                            {
                                "machine_name": "last_name",
                                "friendly_name": "Last Name"
                            }
                        ],
                        "type": "corporate_registry",
                        "name": "Corporate registry"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/government_issued_proof_of_authorized_representative",
                        "fields": [
                            "business_name",
                            "first_name",
                            "last_name"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "business_name",
                                "friendly_name": "Business Name"
                            },
                            {
                                "machine_name": "first_name",
                                "friendly_name": "First Name"
                            },
                            {
                                "machine_name": "last_name",
                                "friendly_name": "Last Name"
                            }
                        ],
                        "type": "government_issued_proof_of_authorized_representative",
                        "name": "Other document issued by a governmental authority to certify the person who has the authority to represent a corporation"
                    }
                ],
                "requirement_name": "ben_ownership_and_identity_info"
            },
            {
                "description": "If applicable",
                "type": "document",
                "name": "Name of Beneficial Owner",
                "accepted_documents": [
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/corporate_registry",
                        "fields": [
                            "first_name",
                            "last_name"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "first_name",
                                "friendly_name": "First Name"
                            },
                            {
                                "machine_name": "last_name",
                                "friendly_name": "Last Name"
                            }
                        ],
                        "type": "corporate_registry",
                        "name": "Corporate registry or foreign equivalent"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/company_seal_certificate",
                        "fields": [
                            "first_name",
                            "last_name"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "first_name",
                                "friendly_name": "First Name"
                            },
                            {
                                "machine_name": "last_name",
                                "friendly_name": "Last Name"
                            }
                        ],
                        "type": "company_seal_certificate",
                        "name": "Company seal certificate or foreign equivalent"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/government_issued_document",
                        "fields": [
                            "first_name",
                            "last_name"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "first_name",
                                "friendly_name": "First Name"
                            },
                            {
                                "machine_name": "last_name",
                                "friendly_name": "Last Name"
                            }
                        ],
                        "type": "government_issued_document",
                        "name": "Any other document issued by a governmental authority with the company's name and address"
                    }
                ],
                "requirement_name": "name_of_ben_owner_info"
            },
            {
                "description": "If applicable",
                "type": "document",
                "name": "Address of Beneficial Owner (Proof of Address)",
                "accepted_documents": [
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/corporate_registry",
                        "fields": [
                            "address_sids"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "address_sids",
                                "friendly_name": "Address sid(s)"
                            }
                        ],
                        "type": "corporate_registry",
                        "name": "Corporate registry or foreign equivalent"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/company_seal_certificate",
                        "fields": [
                            "address_sids"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "address_sids",
                                "friendly_name": "Address sid(s)"
                            }
                        ],
                        "type": "company_seal_certificate",
                        "name": "Company seal certificate or foreign equivalent"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/government_issued_document",
                        "fields": [
                            "address_sids"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "address_sids",
                                "friendly_name": "Address sid(s)"
                            }
                        ],
                        "type": "government_issued_document",
                        "name": "Other document issued by a governmental authority with the company's name and address"
                    }
                ],
                "requirement_name": "address_of_ben_owner_proof_info"
            }
        ],
        [
            {
                "description": "",
                "type": "document",
                "name": "Business Name",
                "accepted_documents": [
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/corporate_registry",
                        "fields": [
                            "business_name"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "business_name",
                                "friendly_name": "Business Name"
                            }
                        ],
                        "type": "corporate_registry",
                        "name": "Corporate registry or foreign equivalent"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/company_seal_certificate",
                        "fields": [
                            "business_name"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "business_name",
                                "friendly_name": "Business Name"
                            }
                        ],
                        "type": "company_seal_certificate",
                        "name": "Company seal certificate or foreign equivalent"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/government_issued_document",
                        "fields": [
                            "business_name"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "business_name",
                                "friendly_name": "Business Name"
                            }
                        ],
                        "type": "government_issued_document",
                        "name": "Any other document issued by a governmental authority with the company's name and address"
                    }
                ],
                "requirement_name": "business_name_info"
            },
            {
                "description": "Must be within locality or region covered by the phone number's prefix; a PO Box is not acceptable where a local address is required.",
                "type": "document",
                "name": "Business Address (Proof of Address)",
                "accepted_documents": [
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/corporate_registry",
                        "fields": [
                            "address_sids"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "address_sids",
                                "friendly_name": "Address sid(s)"
                            }
                        ],
                        "type": "corporate_registry",
                        "name": "Corporate registry or foreign equivalent"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/company_seal_certificate",
                        "fields": [
                            "address_sids"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "address_sids",
                                "friendly_name": "Address sid(s)"
                            }
                        ],
                        "type": "company_seal_certificate",
                        "name": "Company seal certificate or foreign equivalent"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/government_issued_document",
                        "fields": [
                            "address_sids"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "address_sids",
                                "friendly_name": "Address sid(s)"
                            }
                        ],
                        "type": "government_issued_document",
                        "name": "Any other document issued by a governmental authority with the company's name and address"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/tax_document",
                        "fields": [
                            "address_sids"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "address_sids",
                                "friendly_name": "Address sid(s)"
                            }
                        ],
                        "type": "tax_document",
                        "name": "Certificate of tax payment"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/utility_bill",
                        "fields": [
                            "address_sids"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "address_sids",
                                "friendly_name": "Address sid(s)"
                            }
                        ],
                        "type": "utility_bill",
                        "name": "Utility bill"
                    }
                ],
                "requirement_name": "business_address_proof_info"
            },
            {
                "description": "",
                "type": "document",
                "name": "Business Description",
                "accepted_documents": [
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/corporate_registry",
                        "fields": [
                            "business_description"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "business_description",
                                "friendly_name": "Business Description"
                            }
                        ],
                        "type": "corporate_registry",
                        "name": "Corporate registry or Articles of Incorporation"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/government_issued_document",
                        "fields": [
                            "business_description"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "business_description",
                                "friendly_name": "Business Description"
                            }
                        ],
                        "type": "government_issued_document",
                        "name": "Other government-issued document with a business description"
                    }
                ],
                "requirement_name": "business_desc_info"
            },
            {
                "description": "",
                "type": "document",
                "name": "Name of Authorized Representative of Beneficial Owner",
                "accepted_documents": [
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/drivers_license",
                        "fields": [
                            "first_name",
                            "last_name"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "first_name",
                                "friendly_name": "First Name"
                            },
                            {
                                "machine_name": "last_name",
                                "friendly_name": "Last Name"
                            }
                        ],
                        "type": "drivers_license",
                        "name": "Driver's license"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/certificate_driving_record",
                        "fields": [
                            "first_name",
                            "last_name"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "first_name",
                                "friendly_name": "First Name"
                            },
                            {
                                "machine_name": "last_name",
                                "friendly_name": "Last Name"
                            }
                        ],
                        "type": "certificate_driving_record",
                        "name": "Certificate of driving record"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/health_insurance_certificate",
                        "fields": [
                            "first_name",
                            "last_name"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "first_name",
                                "friendly_name": "First Name"
                            },
                            {
                                "machine_name": "last_name",
                                "friendly_name": "Last Name"
                            }
                        ],
                        "type": "health_insurance_certificate",
                        "name": "Health insurance certificate"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/maternity_passbook",
                        "fields": [
                            "first_name",
                            "last_name"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "first_name",
                                "friendly_name": "First Name"
                            },
                            {
                                "machine_name": "last_name",
                                "friendly_name": "Last Name"
                            }
                        ],
                        "type": "maternity_passbook",
                        "name": "Maternity passbook"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/passport",
                        "fields": [
                            "first_name",
                            "last_name"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "first_name",
                                "friendly_name": "First Name"
                            },
                            {
                                "machine_name": "last_name",
                                "friendly_name": "Last Name"
                            }
                        ],
                        "type": "passport",
                        "name": "Passport"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/residence_permit",
                        "fields": [
                            "first_name",
                            "last_name"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "first_name",
                                "friendly_name": "First Name"
                            },
                            {
                                "machine_name": "last_name",
                                "friendly_name": "Last Name"
                            }
                        ],
                        "type": "residence_permit",
                        "name": "Resident card"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/certificate_special_permanent_resident",
                        "fields": [
                            "first_name",
                            "last_name"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "first_name",
                                "friendly_name": "First Name"
                            },
                            {
                                "machine_name": "last_name",
                                "friendly_name": "Last Name"
                            }
                        ],
                        "type": "certificate_special_permanent_resident",
                        "name": "Certificate of special permanent resident"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/seal_certificate_call_transfer_service_agreement",
                        "fields": [
                            "first_name",
                            "last_name"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "first_name",
                                "friendly_name": "First Name"
                            },
                            {
                                "machine_name": "last_name",
                                "friendly_name": "Last Name"
                            }
                        ],
                        "type": "seal_certificate_call_transfer_service_agreement",
                        "name": "Seal certificate of the seal to be used to conclude the call transfer service agreement"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/government_issued_document",
                        "fields": [
                            "first_name",
                            "last_name"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "first_name",
                                "friendly_name": "First Name"
                            },
                            {
                                "machine_name": "last_name",
                                "friendly_name": "Last Name"
                            }
                        ],
                        "type": "government_issued_document",
                        "name": "Any other photo ID issued by a governmental authority with the individual's name, address, and date of birth"
                    }
                ],
                "requirement_name": "name_of_auth_rep_of_ben_owner_info"
            },
            {
                "description": "If applicable",
                "type": "document",
                "name": "Date of Birth of Authorized Representative of Beneficial Owner",
                "accepted_documents": [
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/drivers_license",
                        "fields": [
                            "birth_date"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "birth_date",
                                "friendly_name": "Birth Date"
                            }
                        ],
                        "type": "drivers_license",
                        "name": "Driver's license"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/certificate_driving_record",
                        "fields": [
                            "birth_date"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "birth_date",
                                "friendly_name": "Birth Date"
                            }
                        ],
                        "type": "certificate_driving_record",
                        "name": "Certificate of driving record"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/health_insurance_certificate",
                        "fields": [
                            "birth_date"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "birth_date",
                                "friendly_name": "Birth Date"
                            }
                        ],
                        "type": "health_insurance_certificate",
                        "name": "Health insurance certificate"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/maternity_passbook",
                        "fields": [
                            "birth_date"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "birth_date",
                                "friendly_name": "Birth Date"
                            }
                        ],
                        "type": "maternity_passbook",
                        "name": "Maternity passbook"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/passport",
                        "fields": [
                            "birth_date"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "birth_date",
                                "friendly_name": "Birth Date"
                            }
                        ],
                        "type": "passport",
                        "name": "Passport"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/residence_permit",
                        "fields": [
                            "birth_date"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "birth_date",
                                "friendly_name": "Birth Date"
                            }
                        ],
                        "type": "residence_permit",
                        "name": "Resident card"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/certificate_special_permanent_resident",
                        "fields": [
                            "birth_date"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "birth_date",
                                "friendly_name": "Birth Date"
                            }
                        ],
                        "type": "certificate_special_permanent_resident",
                        "name": "Certificate of special permanent resident"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/seal_certificate_call_transfer_service_agreement",
                        "fields": [
                            "birth_date"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "birth_date",
                                "friendly_name": "Birth Date"
                            }
                        ],
                        "type": "seal_certificate_call_transfer_service_agreement",
                        "name": "Seal certificate of the seal to be used to conclude the call transfer service agreement"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/government_issued_document",
                        "fields": [
                            "birth_date"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "birth_date",
                                "friendly_name": "Birth Date"
                            }
                        ],
                        "type": "government_issued_document",
                        "name": "Any other photo ID issued by a governmental authority with the individual's name, address, and date of birth"
                    }
                ],
                "requirement_name": "birth_date_of_auth_rep_of_ben_owner_info"
            },
            {
                "description": "If applicable",
                "type": "document",
                "name": "Address of Authorized Representative of Beneficial Owner (Proof of Address)",
                "accepted_documents": [
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/drivers_license",
                        "fields": [
                            "address_sids"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "address_sids",
                                "friendly_name": "Address sid(s)"
                            }
                        ],
                        "type": "drivers_license",
                        "name": "Driver's license"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/certificate_driving_record",
                        "fields": [
                            "address_sids"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "address_sids",
                                "friendly_name": "Address sid(s)"
                            }
                        ],
                        "type": "certificate_driving_record",
                        "name": "Certificate of driving record"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/health_insurance_certificate",
                        "fields": [
                            "address_sids"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "address_sids",
                                "friendly_name": "Address sid(s)"
                            }
                        ],
                        "type": "health_insurance_certificate",
                        "name": "Health insurance certificate"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/maternity_passbook",
                        "fields": [
                            "address_sids"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "address_sids",
                                "friendly_name": "Address sid(s)"
                            }
                        ],
                        "type": "maternity_passbook",
                        "name": "Maternity passbook"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/passport",
                        "fields": [
                            "address_sids"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "address_sids",
                                "friendly_name": "Address sid(s)"
                            }
                        ],
                        "type": "passport",
                        "name": "Passport"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/residence_permit",
                        "fields": [
                            "address_sids"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "address_sids",
                                "friendly_name": "Address sid(s)"
                            }
                        ],
                        "type": "residence_permit",
                        "name": "Resident card"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/certificate_special_permanent_resident",
                        "fields": [
                            "address_sids"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "address_sids",
                                "friendly_name": "Address sid(s)"
                            }
                        ],
                        "type": "certificate_special_permanent_resident",
                        "name": "Certificate of special permanent resident"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/seal_certificate_call_transfer_service_agreement",
                        "fields": [
                            "address_sids"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "address_sids",
                                "friendly_name": "Address sid(s)"
                            }
                        ],
                        "type": "seal_certificate_call_transfer_service_agreement",
                        "name": "Seal certificate of the seal to be used to conclude the call transfer service agreement"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/government_issued_document",
                        "fields": [
                            "address_sids"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "address_sids",
                                "friendly_name": "Address sid(s)"
                            }
                        ],
                        "type": "government_issued_document",
                        "name": "Any other photo ID issued by a governmental authority with the individual's name, address, and date of birth"
                    }
                ],
                "requirement_name": "address_of_auth_rep_of_ben_owner_proof_info"
            },
            {
                "description": "If applicable (Proof that representative is authorized to act on behalf of the beneficial owner)",
                "type": "document",
                "name": "Authorization of Representative of Beneficial Owner",
                "accepted_documents": [
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/power_of_attorney",
                        "fields": [],
                        "detailed_fields": [],
                        "type": "power_of_attorney",
                        "name": "Power of attorney"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/company_by_laws",
                        "fields": [
                            "first_name",
                            "last_name"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "first_name",
                                "friendly_name": "First Name"
                            },
                            {
                                "machine_name": "last_name",
                                "friendly_name": "Last Name"
                            }
                        ],
                        "type": "company_by_laws",
                        "name": "Copy of Company By-Laws showing the Authorized Person or Person in Charge of Contract is duly authorized to execute contract"
                    },
                    {
                        "url": "https://numbers.twilio.com/v2/RegulatoryCompliance/SupportingDocumentTypes/letter_of_authorization",
                        "fields": [
                            "first_name",
                            "last_name"
                        ],
                        "detailed_fields": [
                            {
                                "machine_name": "first_name",
                                "friendly_name": "First Name"
                            },
                            {
                                "machine_name": "last_name",
                                "friendly_name": "Last Name"
                            }
                        ],
                        "type": "letter_of_authorization",
                        "name": "Letter on the company letterhead under seal showing the Authorized Person or Person in Charge of Contract is duly authorized to execute contract"
                    }
                ],
                "requirement_name": "auth_of_rep_of_ben_owner_info"
            }
        ]
    ]
}
