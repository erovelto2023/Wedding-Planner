// Seed data for airports and airlines - imported by route.ts
export const defaultAirlines = [
  { name: 'Alaska Airlines', headquarters: 'Seattle, WA', website: 'https://www.alaskaair.com', phone: '1-800-252-7522', notes: '' },
  { name: 'Allegiant Air', headquarters: 'Las Vegas, NV', website: 'https://www.allegiantair.com', phone: '1-702-505-8888', notes: '' },
  { name: 'American Airlines', headquarters: 'Fort Worth, TX', website: 'https://www.aa.com', phone: '1-800-433-7300', notes: '' },
  { name: 'Delta Air Lines', headquarters: 'Atlanta, GA', website: 'https://www.delta.com', phone: '1-800-221-1212', notes: '' },
  { name: 'Frontier Airlines', headquarters: 'Denver, CO', website: 'https://www.flyfrontier.com', phone: '1-801-401-9000', notes: '' },
  { name: 'Hawaiian Airlines', headquarters: 'Honolulu, HI', website: 'https://www.hawaiianairlines.com', phone: '1-800-367-5320', notes: '' },
  { name: 'JetBlue', headquarters: 'New York, NY', website: 'https://www.jetblue.com', phone: '1-800-538-2583', notes: '' },
  { name: 'Southwest Airlines', headquarters: 'Dallas, TX', website: 'https://www.southwest.com', phone: '1-800-435-9792', notes: '' },
  { name: 'United Airlines', headquarters: 'Chicago, IL', website: 'https://www.united.com', phone: '1-800-864-8331', notes: '' },
  { name: 'Avelo Airlines', headquarters: 'Houston, TX', website: 'https://www.aveloair.com', phone: '1-346-616-9500', notes: '' },
  { name: 'Breeze Airways', headquarters: 'Cottonwood Heights, UT', website: 'https://www.flybreeze.com', phone: '1-501-273-3931', notes: '' },
  { name: 'Sun Country Airlines', headquarters: 'Minneapolis, MN', website: 'https://www.suncountry.com', phone: '1-651-905-2737', notes: '' },
];

export const defaultAirports = [
  // Alabama
  { state: 'Alabama', city: 'Birmingham', name: 'Birmingham-Shuttlesworth Intl', code: 'BHM', website: 'https://www.flybirmingham.com', phone: '', notes: '' },
  { state: 'Alabama', city: 'Huntsville', name: 'Huntsville Intl', code: 'HSV', website: 'https://www.flyhuntsville.com', phone: '', notes: '' },
  { state: 'Alabama', city: 'Mobile', name: 'Mobile Regional', code: 'MOB', website: 'https://www.flymobile.com', phone: '', notes: '' },
  // Alaska
  { state: 'Alaska', city: 'Anchorage', name: 'Ted Stevens Anchorage Intl', code: 'ANC', website: 'https://www.anchorageairport.com', phone: '', notes: '' },
  { state: 'Alaska', city: 'Fairbanks', name: 'Fairbanks Intl', code: 'FAI', website: 'https://www.fairbanksairport.com', phone: '', notes: '' },
  { state: 'Alaska', city: 'Juneau', name: 'Juneau Intl', code: 'JNU', website: 'https://www.juneau.org/airport', phone: '', notes: '' },
  // Arizona
  { state: 'Arizona', city: 'Phoenix', name: 'Phoenix Sky Harbor Intl', code: 'PHX', website: 'https://www.skyharbor.com', phone: '', notes: '' },
  { state: 'Arizona', city: 'Tucson', name: 'Tucson Intl', code: 'TUS', website: 'https://www.flytucson.com', phone: '', notes: '' },
  // Arkansas
  { state: 'Arkansas', city: 'Little Rock', name: 'Bill & Hillary Clinton Natl', code: 'LIT', website: 'https://www.flylit.com', phone: '', notes: '' },
  { state: 'Arkansas', city: 'Fayetteville', name: 'Northwest Arkansas Regional', code: 'XNA', website: 'https://www.flyxna.com', phone: '', notes: '' },
  // California
  { state: 'California', city: 'Los Angeles', name: 'Los Angeles Intl', code: 'LAX', website: 'https://www.flylax.com', phone: '', notes: '' },
  { state: 'California', city: 'San Francisco', name: 'San Francisco Intl', code: 'SFO', website: 'https://www.flysfo.com', phone: '', notes: '' },
  { state: 'California', city: 'San Diego', name: 'San Diego Intl', code: 'SAN', website: 'https://www.san.org', phone: '', notes: '' },
  { state: 'California', city: 'Oakland', name: 'Oakland Intl', code: 'OAK', website: 'https://www.oaklandairport.com', phone: '', notes: '' },
  { state: 'California', city: 'San Jose', name: 'San Jose Intl', code: 'SJC', website: 'https://www.flysanjose.com', phone: '', notes: '' },
  { state: 'California', city: 'Sacramento', name: 'Sacramento Intl', code: 'SMF', website: 'https://www.sacramento.aero', phone: '', notes: '' },
  { state: 'California', city: 'Santa Ana', name: 'John Wayne (Orange County)', code: 'SNA', website: 'https://www.ocair.com', phone: '', notes: '' },
  { state: 'California', city: 'Long Beach', name: 'Long Beach Airport', code: 'LGB', website: 'https://www.lgb.org', phone: '', notes: '' },
  { state: 'California', city: 'Burbank', name: 'Burbank Bob Hope', code: 'BUR', website: 'https://www.hollywoodburbankairport.com', phone: '', notes: '' },
  { state: 'California', city: 'Ontario', name: 'Ontario Intl', code: 'ONT', website: 'https://www.flyontario.com', phone: '', notes: '' },
  { state: 'California', city: 'Palm Springs', name: 'Palm Springs Intl', code: 'PSP', website: 'https://www.pspairport.com', phone: '', notes: '' },
  // Colorado
  { state: 'Colorado', city: 'Denver', name: 'Denver Intl', code: 'DEN', website: 'https://www.flydenver.com', phone: '', notes: '' },
  { state: 'Colorado', city: 'Colorado Springs', name: 'Colorado Springs', code: 'COS', website: 'https://www.flycos.com', phone: '', notes: '' },
  { state: 'Colorado', city: 'Aspen', name: 'Aspen-Pitkin County', code: 'ASE', website: 'https://www.aspenairport.com', phone: '', notes: '' },
  // Connecticut
  { state: 'Connecticut', city: 'Windsor Locks', name: 'Bradley Intl', code: 'BDL', website: 'https://www.bradleyairport.com', phone: '', notes: '' },
  // Florida
  { state: 'Florida', city: 'Miami', name: 'Miami Intl', code: 'MIA', website: 'https://www.miami-airport.com', phone: '', notes: '' },
  { state: 'Florida', city: 'Orlando', name: 'Orlando Intl', code: 'MCO', website: 'https://www.orlandoairports.net', phone: '', notes: '' },
  { state: 'Florida', city: 'Fort Lauderdale', name: 'Fort Lauderdale-Hollywood Intl', code: 'FLL', website: 'https://www.broward.org/airport', phone: '', notes: '' },
  { state: 'Florida', city: 'Tampa', name: 'Tampa Intl', code: 'TPA', website: 'https://www.tampaairport.com', phone: '', notes: '' },
  { state: 'Florida', city: 'Fort Myers', name: 'Southwest Florida Intl', code: 'RSW', website: 'https://www.flylcpa.com', phone: '', notes: '' },
  { state: 'Florida', city: 'Jacksonville', name: 'Jacksonville Intl', code: 'JAX', website: 'https://www.flyjax.com', phone: '', notes: '' },
  { state: 'Florida', city: 'West Palm Beach', name: 'Palm Beach Intl', code: 'PBI', website: 'https://www.pbia.org', phone: '', notes: '' },
  { state: 'Florida', city: 'Sarasota', name: 'Sarasota-Bradenton Intl', code: 'SRQ', website: 'https://www.srq-airport.com', phone: '', notes: '' },
  // Georgia
  { state: 'Georgia', city: 'Atlanta', name: 'Hartsfield-Jackson Atlanta Intl', code: 'ATL', website: 'https://www.atl.com', phone: '', notes: '' },
  { state: 'Georgia', city: 'Savannah', name: 'Savannah/Hilton Head Intl', code: 'SAV', website: 'https://www.savannahairport.com', phone: '', notes: '' },
  // Hawaii
  { state: 'Hawaii', city: 'Honolulu', name: 'Daniel K. Inouye Intl', code: 'HNL', website: 'https://hidot.hawaii.gov/airports/hnl', phone: '', notes: '' },
  { state: 'Hawaii', city: 'Kahului (Maui)', name: 'Kahului Airport', code: 'OGG', website: 'https://hidot.hawaii.gov/airports/ogg', phone: '', notes: '' },
  { state: 'Hawaii', city: 'Kailua-Kona', name: 'Kona Intl', code: 'KOA', website: 'https://hidot.hawaii.gov/airports/koa', phone: '', notes: '' },
  { state: 'Hawaii', city: 'Lihue (Kauai)', name: 'Lihue Airport', code: 'LIH', website: 'https://hidot.hawaii.gov/airports/lih', phone: '', notes: '' },
  // Idaho
  { state: 'Idaho', city: 'Boise', name: 'Boise Airport', code: 'BOI', website: 'https://www.iflyboise.com', phone: '', notes: '' },
  // Illinois
  { state: 'Illinois', city: 'Chicago', name: "Chicago O'Hare Intl", code: 'ORD', website: 'https://www.flychicago.com/ohare', phone: '', notes: '' },
  { state: 'Illinois', city: 'Chicago', name: 'Chicago Midway Intl', code: 'MDW', website: 'https://www.flychicago.com/midway', phone: '', notes: '' },
  // Indiana
  { state: 'Indiana', city: 'Indianapolis', name: 'Indianapolis Intl', code: 'IND', website: 'https://www.flyind.com', phone: '', notes: '' },
  // Iowa
  { state: 'Iowa', city: 'Des Moines', name: 'Des Moines Intl', code: 'DSM', website: 'https://www.dsmairport.com', phone: '', notes: '' },
  { state: 'Iowa', city: 'Cedar Rapids', name: 'Eastern Iowa', code: 'CID', website: 'https://www.flycia.com', phone: '', notes: '' },
  // Kansas
  { state: 'Kansas', city: 'Wichita', name: 'Wichita Dwight D. Eisenhower Natl', code: 'ICT', website: 'https://www.flywichita.com', phone: '', notes: '' },
  // Kentucky
  { state: 'Kentucky', city: 'Louisville', name: 'Louisville Muhammad Ali Intl', code: 'SDF', website: 'https://www.flylouisville.com', phone: '', notes: '' },
  { state: 'Kentucky', city: 'Lexington', name: 'Blue Grass Airport', code: 'LEX', website: 'https://www.bluegrassairport.com', phone: '', notes: '' },
  // Louisiana
  { state: 'Louisiana', city: 'New Orleans', name: 'Louis Armstrong New Orleans Intl', code: 'MSY', website: 'https://www.flymsy.com', phone: '', notes: '' },
  { state: 'Louisiana', city: 'Baton Rouge', name: 'Baton Rouge Metropolitan', code: 'BTR', website: 'https://www.btrairport.com', phone: '', notes: '' },
  // Maine
  { state: 'Maine', city: 'Portland', name: 'Portland Intl Jetport', code: 'PWM', website: 'https://www.portlandjetport.org', phone: '', notes: '' },
  { state: 'Maine', city: 'Bangor', name: 'Bangor Intl', code: 'BGR', website: 'https://www.bangorintl.com', phone: '', notes: '' },
  // Maryland
  { state: 'Maryland', city: 'Baltimore', name: 'Baltimore/Washington Intl Thurgood Marshall', code: 'BWI', website: 'https://www.bwiairport.com', phone: '', notes: '' },
  // Massachusetts
  { state: 'Massachusetts', city: 'Boston', name: 'Boston Logan Intl', code: 'BOS', website: 'https://www.massport.com/logan', phone: '', notes: '' },
  // Michigan
  { state: 'Michigan', city: 'Detroit', name: 'Detroit Metro Wayne County', code: 'DTW', website: 'https://www.dtw.com', phone: '', notes: '' },
  { state: 'Michigan', city: 'Grand Rapids', name: 'Gerald R. Ford Intl', code: 'GRR', website: 'https://www.flygrd.com', phone: '', notes: '' },
  // Minnesota
  { state: 'Minnesota', city: 'Minneapolis', name: 'Minneapolis-St. Paul Intl', code: 'MSP', website: 'https://www.mspairport.com', phone: '', notes: '' },
  // Mississippi
  { state: 'Mississippi', city: 'Jackson', name: 'Jackson-Medgar Wiley Evers Intl', code: 'JAN', website: 'https://www.jmaa.com', phone: '', notes: '' },
  { state: 'Mississippi', city: 'Gulfport', name: 'Gulfport-Biloxi Intl', code: 'GPT', website: 'https://www.gptairport.com', phone: '', notes: '' },
  // Missouri
  { state: 'Missouri', city: 'Kansas City', name: 'Kansas City Intl', code: 'MCI', website: 'https://www.flykci.com', phone: '', notes: '' },
  { state: 'Missouri', city: 'St. Louis', name: 'St. Louis Lambert Intl', code: 'STL', website: 'https://www.stlairport.com', phone: '', notes: '' },
  // Montana
  { state: 'Montana', city: 'Bozeman', name: 'Bozeman Yellowstone Intl', code: 'BZN', website: 'https://www.bozemanairport.com', phone: '', notes: '' },
  { state: 'Montana', city: 'Billings', name: 'Billings Logan Intl', code: 'BIL', website: 'https://www.billingsairport.com', phone: '', notes: '' },
  { state: 'Montana', city: 'Kalispell', name: 'Glacier Park Intl', code: 'GPI', website: 'https://www.glacierparkairport.com', phone: '', notes: '' },
  // Nebraska
  { state: 'Nebraska', city: 'Omaha', name: 'Eppley Airfield', code: 'OMA', website: 'https://www.eppleyairfield.com', phone: '', notes: '' },
  // Nevada
  { state: 'Nevada', city: 'Las Vegas', name: 'Harry Reid Intl', code: 'LAS', website: 'https://www.harryreidairport.com', phone: '', notes: '' },
  { state: 'Nevada', city: 'Reno', name: 'Reno-Tahoe Intl', code: 'RNO', website: 'https://www.renoairport.com', phone: '', notes: '' },
  // New Hampshire
  { state: 'New Hampshire', city: 'Manchester', name: 'Manchester-Boston Regional', code: 'MHT', website: 'https://www.flymanchester.com', phone: '', notes: '' },
  // New Jersey
  { state: 'New Jersey', city: 'Newark', name: 'Newark Liberty Intl', code: 'EWR', website: 'https://www.newarkairport.com', phone: '', notes: '' },
  { state: 'New Jersey', city: 'Egg Harbor Twp', name: 'Atlantic City Intl', code: 'ACY', website: 'https://www.acyairport.com', phone: '', notes: '' },
  // New Mexico
  { state: 'New Mexico', city: 'Albuquerque', name: 'Albuquerque Intl Sunport', code: 'ABQ', website: 'https://www.abqsunport.com', phone: '', notes: '' },
  // New York
  { state: 'New York', city: 'New York', name: 'John F. Kennedy Intl', code: 'JFK', website: 'https://www.jfkairport.com', phone: '', notes: '' },
  { state: 'New York', city: 'New York', name: 'LaGuardia Airport', code: 'LGA', website: 'https://www.laguardiaairport.com', phone: '', notes: '' },
  { state: 'New York', city: 'Albany', name: 'Albany Intl', code: 'ALB', website: 'https://www.albanyairport.com', phone: '', notes: '' },
  { state: 'New York', city: 'Buffalo', name: 'Buffalo Niagara Intl', code: 'BUF', website: 'https://www.buffaloairport.com', phone: '', notes: '' },
  { state: 'New York', city: 'Syracuse', name: 'Syracuse Hancock Intl', code: 'SYR', website: 'https://www.syracuseairport.com', phone: '', notes: '' },
  { state: 'New York', city: 'White Plains', name: 'Westchester County', code: 'HPN', website: 'https://www.westchesterairport.com', phone: '', notes: '' },
  // North Carolina
  { state: 'North Carolina', city: 'Charlotte', name: 'Charlotte Douglas Intl', code: 'CLT', website: 'https://www.cltairport.com', phone: '', notes: '' },
  { state: 'North Carolina', city: 'Raleigh/Durham', name: 'Raleigh-Durham Intl', code: 'RDU', website: 'https://www.rdu.com', phone: '', notes: '' },
  // North Dakota
  { state: 'North Dakota', city: 'Fargo', name: 'Hector Intl', code: 'FAR', website: 'https://www.flyfargo.com', phone: '', notes: '' },
  // Ohio
  { state: 'Ohio', city: 'Cleveland', name: 'Cleveland Hopkins Intl', code: 'CLE', website: 'https://www.clevelandairport.com', phone: '', notes: '' },
  { state: 'Ohio', city: 'Columbus', name: 'John Glenn Columbus Intl', code: 'CMH', website: 'https://www.flycolumbus.com', phone: '', notes: '' },
  { state: 'Ohio', city: 'Cincinnati', name: 'Cincinnati/Northern Kentucky Intl', code: 'CVG', website: 'https://www.cvgairport.com', phone: '', notes: '' },
  { state: 'Ohio', city: 'Akron/Canton', name: 'Akron-Canton Regional', code: 'CAK', website: 'https://www.akroncantonairport.com', phone: '', notes: '' },
  // Oklahoma
  { state: 'Oklahoma', city: 'Oklahoma City', name: 'Will Rogers World', code: 'OKC', website: 'https://www.flyokc.com', phone: '', notes: '' },
  { state: 'Oklahoma', city: 'Tulsa', name: 'Tulsa Intl', code: 'TUL', website: 'https://www.flytulsa.com', phone: '', notes: '' },
  // Oregon
  { state: 'Oregon', city: 'Portland', name: 'Portland Intl', code: 'PDX', website: 'https://www.pdx.com', phone: '', notes: '' },
  { state: 'Oregon', city: 'Eugene', name: 'Eugene Airport', code: 'EUG', website: 'https://www.flyeug.com', phone: '', notes: '' },
  // Pennsylvania
  { state: 'Pennsylvania', city: 'Philadelphia', name: 'Philadelphia Intl', code: 'PHL', website: 'https://www.phl.org', phone: '', notes: '' },
  { state: 'Pennsylvania', city: 'Pittsburgh', name: 'Pittsburgh Intl', code: 'PIT', website: 'https://www.flypittsburgh.com', phone: '', notes: '' },
  { state: 'Pennsylvania', city: 'Allentown', name: 'Lehigh Valley Intl', code: 'ABE', website: 'https://www.flyabe.com', phone: '', notes: '' },
  // Rhode Island
  { state: 'Rhode Island', city: 'Providence', name: 'T.F. Green', code: 'PVD', website: 'https://www.pvdairport.com', phone: '', notes: '' },
  // South Carolina
  { state: 'South Carolina', city: 'Charleston', name: 'Charleston Intl', code: 'CHS', website: 'https://www.chs-airport.com', phone: '', notes: '' },
  { state: 'South Carolina', city: 'Greenville', name: 'Greenville-Spartanburg Intl', code: 'GSP', website: 'https://www.gspairport.com', phone: '', notes: '' },
  { state: 'South Carolina', city: 'Myrtle Beach', name: 'Myrtle Beach Intl', code: 'MYR', website: 'https://www.flymyrtlebeach.com', phone: '', notes: '' },
  // South Dakota
  { state: 'South Dakota', city: 'Sioux Falls', name: 'Sioux Falls Regional', code: 'FSD', website: 'https://www.siouxfallsairport.com', phone: '', notes: '' },
  // Tennessee
  { state: 'Tennessee', city: 'Nashville', name: 'Nashville Intl', code: 'BNA', website: 'https://www.flynashville.com', phone: '', notes: '' },
  { state: 'Tennessee', city: 'Memphis', name: 'Memphis Intl', code: 'MEM', website: 'https://www.flymemphis.com', phone: '', notes: '' },
  // Texas
  { state: 'Texas', city: 'Dallas/Fort Worth', name: 'Dallas/Fort Worth Intl', code: 'DFW', website: 'https://www.dfwairport.com', phone: '', notes: '' },
  { state: 'Texas', city: 'Houston', name: 'George Bush Intercontinental', code: 'IAH', website: 'https://www.fly2houston.com/iah', phone: '', notes: '' },
  { state: 'Texas', city: 'Houston', name: 'William P. Hobby', code: 'HOU', website: 'https://www.fly2houston.com/hobby', phone: '', notes: '' },
  { state: 'Texas', city: 'Austin', name: 'Austin-Bergstrom Intl', code: 'AUS', website: 'https://www.austintexas.gov/airport', phone: '', notes: '' },
  { state: 'Texas', city: 'San Antonio', name: 'San Antonio Intl', code: 'SAT', website: 'https://www.flysanantonio.com', phone: '', notes: '' },
  { state: 'Texas', city: 'Dallas', name: 'Dallas Love Field', code: 'DAL', website: 'https://www.dalairport.com', phone: '', notes: '' },
  // Utah
  { state: 'Utah', city: 'Salt Lake City', name: 'Salt Lake City Intl', code: 'SLC', website: 'https://www.slcairport.com', phone: '', notes: '' },
  // Vermont
  { state: 'Vermont', city: 'South Burlington', name: 'Burlington Intl', code: 'BTV', website: 'https://www.burlingtonairport.com', phone: '', notes: '' },
  // Virginia
  { state: 'Virginia', city: 'Dulles', name: 'Washington Dulles Intl', code: 'IAD', website: 'https://www.dullesairport.com', phone: '', notes: '' },
  { state: 'Virginia', city: 'Arlington', name: 'Ronald Reagan Washington National', code: 'DCA', website: 'https://www.flyreagan.com', phone: '', notes: '' },
  { state: 'Virginia', city: 'Norfolk', name: 'Norfolk Intl', code: 'ORF', website: 'https://www.norfolkairport.com', phone: '', notes: '' },
  { state: 'Virginia', city: 'Richmond', name: 'Richmond Intl', code: 'RIC', website: 'https://www.richmondairport.com', phone: '', notes: '' },
  // Washington
  { state: 'Washington', city: 'Seattle', name: 'Seattle-Tacoma Intl', code: 'SEA', website: 'https://www.portseattle.org/sea-tac', phone: '', notes: '' },
  { state: 'Washington', city: 'Spokane', name: 'Spokane Intl', code: 'GEG', website: 'https://www.spokaneairports.net', phone: '', notes: '' },
  // West Virginia
  { state: 'West Virginia', city: 'Charleston', name: 'Yeager Airport', code: 'CRW', website: 'https://www.yeagerairport.com', phone: '', notes: '' },
  // Wisconsin
  { state: 'Wisconsin', city: 'Milwaukee', name: 'Milwaukee Mitchell Intl', code: 'MKE', website: 'https://www.mkeairport.com', phone: '', notes: '' },
  { state: 'Wisconsin', city: 'Madison', name: 'Dane County Regional', code: 'MSN', website: 'https://www.madisonairport.com', phone: '', notes: '' },
  // Wyoming
  { state: 'Wyoming', city: 'Jackson', name: 'Jackson Hole Airport', code: 'JAC', website: 'https://www.jacksonholeairport.com', phone: '', notes: '' },
  { state: 'Wyoming', city: 'Cheyenne', name: 'Cheyenne Regional', code: 'CYS', website: 'https://www.cheyenneairport.com', phone: '', notes: '' },
];
