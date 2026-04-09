// require('dotenv').config();
// const { createClient } = require("@supabase/supabase-js");

// const supabase = createClient(
//     "https://riyhnmipjhdaprvxljis.supabase.co",
//     "sb_publishable_uuPjo6JxVzJ6LgGS1KB6Lw_jEicLppb"
//   );

// // Список учеников
// const students = [
//     { student_name: "Берилко Ника", mother_name: "Берилко Татьяна Викторовна", mother_phone: "89162352805" },
//     { student_name: "Выборная Злата", mother_name: "Выборная Кристина Сергеевна", mother_phone: "89153102050" },
//     { student_name: "Гиряев Тимофей", mother_name: "Васильковская Ольга Леонидовна", mother_phone: "89265814321" },
//     { student_name: "Евдокимов Артемий", mother_name: "Евдокимова Юлия Васильевна", mother_phone: "89261280098" },
//     { student_name: "Егошина Лиза", mother_name: "Егошина Ольга Вадимовна", mother_phone: "89175428212" },
//     { student_name: "Зимбицкая Анна", mother_name: "Зимбицкая Екатерина Юрьевна", mother_phone: "89646305987" },
//     { student_name: "Илларионов Денис", mother_name: "Илларионова Анастасия Олеговна", mother_phone: null },
//     { student_name: "Капаев Артур", mother_name: "Иванова Ольга Владимировна", mother_phone: "89588345320" },
//     { student_name: "Капаева Василиса", mother_name: "Иванова Ольга Владимировна", mother_phone: "89588345320" },
//     { student_name: "Каргина Виктория", mother_name: "Каргина Ольга Юсифовна", mother_phone: "89207947865" },
//     { student_name: "Климов Ярослав", mother_name: "Климова Марина Александровна", mother_phone: "89267039925" },
//     { student_name: "Королёв Дмитрий", mother_name: "Королёва Елена Юрьевна", mother_phone: "89031922848" },
//     { student_name: "Кочарыгин Артём", mother_name: "Кочарыгина Ирина Михайловна", mother_phone: "89165173067" },
//     { student_name: "Коробицына Лиза", mother_name: "Коробицына Славяна Викторовна", mother_phone: "89157153806" },
//     { student_name: "Кудрявцева Елена", mother_name: "Кудрявцева Ольга Александровна", mother_phone: "89167087734" },
//     { student_name: "Лифанов Артём", mother_name: "Лифанова Анна Владимировна", mother_phone: "89037265968" },
//     { student_name: "Лазинцев Ростислав", mother_name: "Лазинцева Юлия Сергеевна", mother_phone: "89772715642" },
//     { student_name: "Медведева Екатерина", mother_name: "Медведева Татьяна Александровна", mother_phone: "89165892037" },
//     { student_name: "Молодовский Савва", mother_name: "Молодовская Екатерина Владимировна", mother_phone: "89150124123" },
//     { student_name: "Московцев Саша", mother_name: "Московцева Ирина Сергеевна", mother_phone: "89778762574" },
//     { student_name: "Панюшкина Валерия", mother_name: "Панюшкина Александра Вячеславовна", mother_phone: "899996713328" },
//     { student_name: "Петровский Тимофей", mother_name: "Юлия", mother_phone: null },
//     { student_name: "Пушкарёва Таня", mother_name: "Пушкарева Наталья", mother_phone: "89653996240" },
//     { student_name: "Рябых Настя", mother_name: "Рябых Елена Николаевна", mother_phone: "89264262569" },
//     { student_name: "Саликов Денис", mother_name: "Ильнара", mother_phone: null },
//     { student_name: "Сергунин Виталий", mother_name: "Сергунина Юлия Сергеевна", mother_phone: "89099651287" },
//     { student_name: "Тарасовец Давид", mother_name: "Хаярова Екатерина Рауфовна", mother_phone: "89260303747" },
//     { student_name: "Третьякова София", mother_name: "Третьякова Светлана Андреевна", mother_phone: "89151166631" },
//     { student_name: "Чечулина Дарья", mother_name: null, mother_phone: null },
//     { student_name: "Шиврина Ксения", mother_name: "Шиврина Алина Андреевна", mother_phone: "89258849819" },
//     { student_name: "Шинкарёва Василина", mother_name: "Шинкарёва Татьяна Юрьевна", mother_phone: "89653001313" },
//     { student_name: "Шарипова Марям", mother_name: "Шарипова Татьяна Николаевна", mother_phone: null }
//   ]
  
//   async function insertStudents() {
//     const { data, error } = await supabase
//       .from('students')
//       .insert(students);
  
//     if (error) {
//       console.error('Ошибка вставки:', error);
//     } else if (data) {
//       console.log('Добавлено учеников:', data.length);
//     } else {
//       console.log('Данные не возвращаются, но ошибок нет');
//     }
//   }
  
//   insertStudents();
//   async function removeDuplicates() {
//     // Сначала получаем все строки
//     const { data: students, error } = await supabase.from('students').select('*');
//     if (error) return console.error(error);
  
//     const seen = new Set();
//     for (let s of students) {
//       const key = `${s.student_name}-${s.mother_name}`;
//       if (seen.has(key)) {
//         await supabase.from('students').delete().eq('id', s.id);
//         console.log('Удалено:', s.student_name);
//       } else {
//         seen.add(key);
//       }
//     }
//   }
  
//   removeDuplicates();