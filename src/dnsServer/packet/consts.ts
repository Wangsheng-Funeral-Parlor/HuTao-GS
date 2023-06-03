function reverseMap(src: any): any {
  const dst = {}

  for (const k in src) {
    const v = src[k]
    if (v != null) dst[v] = k
  }

  return dst
}

// http://www.iana.org/assignments/dns-parameters
export const NAME_TO_QTYPE = {
  A: 0x01,
  NS: 0x02,
  MD: 0x03,
  MF: 0x04,
  CNAME: 0x05,
  SOA: 0x06,
  MB: 0x07,
  MG: 0x08,
  MR: 0x09,
  NULL: 0x0a,
  WKS: 0x0b,
  PTR: 0x0c,
  HINFO: 0x0d,
  MINFO: 0x0e,
  MX: 0x0f,
  TXT: 0x10,
  RP: 0x11,
  AFSDB: 0x12,
  X25: 0x13,
  ISDN: 0x14,
  RT: 0x15,
  NSAP: 0x16,
  "NSAP-PTR": 0x17,
  SIG: 0x18,
  KEY: 0x19,
  PX: 0x1a,
  GPOS: 0x1b,
  AAAA: 0x1c,
  LOC: 0x1d,
  NXT: 0x1e,
  EID: 0x1f,
  NIMLOC: 0x20,
  SRV: 0x21,
  ATMA: 0x22,
  NAPTR: 0x23,
  KX: 0x24,
  CERT: 0x25,
  A6: 0x26,
  DNAME: 0x27,
  SINK: 0x28,
  EDNS: 0x29,
  APL: 0x2a,
  DS: 0x2b,
  SSHFP: 0x2c,
  IPSECKEY: 0x2d,
  RRSIG: 0x2e,
  NSEC: 0x2f,
  DNSKEY: 0x30,
  DHCID: 0x31,
  NSEC3: 0x32,
  NSEC3PARAM: 0x33,
  TLSA: 0x34,
  HIP: 0x37,
  NINFO: 0x38,
  RKEY: 0x39,
  TALINK: 0x3a,
  CDS: 0x3b,
  SVCB: 0x40,
  HTTPS: 0x41,
  SPF: 0x63,
  UINFO: 0x64,
  UID: 0x65,
  GID: 0x66,
  UNSPEC: 0x67,
  TKEY: 0xf9,
  TSIG: 0xfa,
  IXFR: 0xfb,
  AXFR: 0xfc,
  MAILB: 0xfd,
  MAILA: 0xfe,
  ANY: 0xff,
  URI: 0x100,
  CAA: 0x101,
  TA: 0x8000,
  DLV: 0x8001,
}
export const QTYPE_TO_NAME: { [t: number]: string } = reverseMap(NAME_TO_QTYPE)

export const nameToQtype = (n: string) => NAME_TO_QTYPE[n.toUpperCase()]
export const qtypeToName = (t: number) => QTYPE_TO_NAME[t]

export const NAME_TO_QCLASS = {
  IN: 0x01,
  CS: 0x02,
  CH: 0x03,
  HS: 0x04,
  ANY: 0xff,
}
export const QCLASS_TO_NAME: { [c: number]: string } = reverseMap(NAME_TO_QCLASS)

export const FAMILY_TO_QTYPE = {
  4: NAME_TO_QTYPE.A,
  6: NAME_TO_QTYPE.AAAA,
}
export const QTYPE_TO_FAMILY = {
  [NAME_TO_QTYPE.A]: 4,
  [NAME_TO_QTYPE.AAAA]: 6,
}

export const NAME_TO_RCODE = {
  NOERROR: 0,
  FORMERR: 1,
  SERVFAIL: 2,
  NOTFOUND: 3,
  NOTIMP: 4,
  REFUSED: 5,
  YXDOMAIN: 6, //Name Exists when it should not
  YXRRSET: 7, //RR Set Exists when it should not
  NXRRSET: 8, //RR Set that should exist does not
  NOTAUTH: 9,
  NOTZONE: 10,
  BADVERS: 16,
  BADSIG: 16, // really?
  BADKEY: 17,
  BADTIME: 18,
  BADMODE: 19,
  BADNAME: 20,
  BADALG: 21,
  BADTRUNC: 22,
}
export const RCODE_TO_NAME: { [c: number]: string } = reverseMap(NAME_TO_RCODE)

export const NAME_TO_EDNS = {
  ECS: 0x08,
}
export const EDNS_TO_NAME: { [c: number]: string } = reverseMap(NAME_TO_EDNS)

export const BADNAME = "EBADNAME"
export const BADRESP = "EBADRESP"
export const CONNREFUSED = "ECONNREFUSED"
export const DESTRUCTION = "EDESTRUCTION"
export const REFUSED = "EREFUSED"
export const FORMERR = "EFORMERR"
export const NODATA = "ENODATA"
export const NOMEM = "ENOMEM"
export const NOTFOUND = "ENOTFOUND"
export const NOTIMP = "ENOTIMP"
export const SERVFAIL = "ESERVFAIL"
export const TIMEOUT = "ETIMEOUT"
