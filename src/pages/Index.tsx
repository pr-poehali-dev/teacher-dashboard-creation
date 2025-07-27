import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Icon from '@/components/ui/icon';

interface Student {
  id: number;
  name: string;
  class: string;
  grades: GradeEntry[];
  absences: { type: 'Н' | 'УП' | 'Б' | 'С'; count: number }[];
  average: number;
  isProblematic: boolean;
  notes: string;
}

interface GradeEntry {
  id: number;
  value: number;
  type: 'Домашняя работа' | 'Контрольная работа' | 'Самостоятельная работа';
  date: string;
  subject: string;
}

const Index = () => {
  // Load data from localStorage helper
  const loadData = <T>(key: string, defaultValue: T): T => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState(() => loadData('teacherCabinet_activeTab', 'dashboard'));
  const [selectedClass, setSelectedClass] = useState(() => loadData('teacherCabinet_selectedClass', '9А'));
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddGradeOpen, setIsAddGradeOpen] = useState(false);
  const [selectedStudentForGrade, setSelectedStudentForGrade] = useState<number | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isAddAbsenceOpen, setIsAddAbsenceOpen] = useState(false);
  const [selectedStudentForAbsence, setSelectedStudentForAbsence] = useState<number | null>(null);
  const [newAbsenceType, setNewAbsenceType] = useState<'Н' | 'УП' | 'Б' | 'С'>('Н');
  const [newAbsenceReason, setNewAbsenceReason] = useState('');

  // Form states
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentClass, setNewStudentClass] = useState('9А');
  const [newStudentNotes, setNewStudentNotes] = useState('');
  const [newGrade, setNewGrade] = useState(5);
  const [newGradeType, setNewGradeType] = useState<'Домашняя работа' | 'Контрольная работа' | 'Самостоятельная работа'>('Домашняя работа');

  // Constructor states
  const [selectedSubject, setSelectedSubject] = useState(() => loadData('teacherCabinet_selectedSubject', 'Математика'));
  const [selectedTopic, setSelectedTopic] = useState(() => loadData('teacherCabinet_selectedTopic', ''));
  const [selectedTasks, setSelectedTasks] = useState<string[]>(() => loadData('teacherCabinet_selectedTasks', []));
  const [generatedTest, setGeneratedTest] = useState<string>(() => loadData('teacherCabinet_generatedTest', ''));

  // Mock data
  const classes = ['9А', '9Б', '10А', '10Б', '11А'];
  const [students, setStudents] = useState<Student[]>(() => loadData('teacherCabinet_students', [
    {
      id: 1,
      name: 'Иванов Иван',
      class: '9А',
      grades: [
        { id: 1, value: 5, type: 'Домашняя работа', date: '2024-07-20', subject: 'Математика' },
        { id: 2, value: 4, type: 'Контрольная работа', date: '2024-07-22', subject: 'Математика' },
        { id: 3, value: 5, type: 'Самостоятельная работа', date: '2024-07-24', subject: 'Математика' }
      ],
      absences: [
        { type: 'Н', count: 2 },
        { type: 'УП', count: 1 },
        { type: 'Б', count: 3 },
        { type: 'С', count: 0 }
      ],
      average: 4.7,
      isProblematic: false,
      notes: 'Хорошо подготовлен к урокам'
    },
    {
      id: 2,
      name: 'Петрова София',
      class: '9А',
      grades: [
        { id: 4, value: 3, type: 'Домашняя работа', date: '2024-07-20', subject: 'Математика' },
        { id: 5, value: 2, type: 'Контрольная работа', date: '2024-07-22', subject: 'Математика' },
        { id: 6, value: 3, type: 'Самостоятельная работа', date: '2024-07-24', subject: 'Математика' }
      ],
      absences: [
        { type: 'Н', count: 5 },
        { type: 'УП', count: 0 },
        { type: 'Б', count: 1 },
        { type: 'С', count: 0 }
      ],
      average: 2.7,
      isProblematic: true,
      notes: 'Требует дополнительного внимания'
    },
    {
      id: 3,
      name: 'Сидоров Максим',
      class: '9Б',
      grades: [
        { id: 7, value: 5, type: 'Домашняя работа', date: '2024-07-20', subject: 'Математика' },
        { id: 8, value: 5, type: 'Контрольная работа', date: '2024-07-22', subject: 'Математика' },
        { id: 9, value: 4, type: 'Самостоятельная работа', date: '2024-07-24', subject: 'Математика' }
      ],
      absences: [
        { type: 'Н', count: 0 },
        { type: 'УП', count: 2 },
        { type: 'Б', count: 0 },
        { type: 'С', count: 1 }
      ],
      average: 4.7,
      isProblematic: false,
      notes: 'Отличник, активно участвует'
    }
  ]));

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('teacherCabinet_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('teacherCabinet_selectedClass', selectedClass);
  }, [selectedClass]);

  useEffect(() => {
    localStorage.setItem('teacherCabinet_activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('teacherCabinet_selectedSubject', selectedSubject);
  }, [selectedSubject]);

  useEffect(() => {
    localStorage.setItem('teacherCabinet_selectedTopic', selectedTopic);
  }, [selectedTopic]);

  useEffect(() => {
    localStorage.setItem('teacherCabinet_selectedTasks', JSON.stringify(selectedTasks));
  }, [selectedTasks]);

  useEffect(() => {
    localStorage.setItem('teacherCabinet_generatedTest', generatedTest);
  }, [generatedTest]);

  const handleLogin = () => {
    if (password === '123456789') {
      setIsAuthenticated(true);
    } else {
      alert('Неверный пароль!');
    }
  };

  const addStudent = () => {
    if (!newStudentName.trim()) return;

    const newStudent: Student = {
      id: Date.now(),
      name: newStudentName,
      class: newStudentClass,
      grades: [],
      absences: [
        { type: 'Н', count: 0 },
        { type: 'УП', count: 0 },
        { type: 'Б', count: 0 },
        { type: 'С', count: 0 }
      ],
      average: 0,
      isProblematic: false,
      notes: newStudentNotes
    };

    setStudents([...students, newStudent]);
    setNewStudentName('');
    setNewStudentClass('9А');
    setNewStudentNotes('');
    setIsAddStudentOpen(false);
  };

  const deleteStudent = (studentId: number) => {
    if (confirm('Вы уверены, что хотите удалить этого ученика?')) {
      setStudents(students.filter(s => s.id !== studentId));
    }
  };

  const addGrade = () => {
    if (selectedStudentForGrade === null) return;

    const newGradeEntry: GradeEntry = {
      id: Date.now(),
      value: newGrade,
      type: newGradeType,
      date: new Date().toISOString().split('T')[0],
      subject: 'Математика'
    };

    setStudents(students.map(student => {
      if (student.id === selectedStudentForGrade) {
        const updatedGrades = [...student.grades, newGradeEntry];
        const average = updatedGrades.reduce((sum, g) => sum + g.value, 0) / updatedGrades.length;
        return {
          ...student,
          grades: updatedGrades,
          average: Math.round(average * 10) / 10,
          isProblematic: average < 3
        };
      }
      return student;
    }));

    setIsAddGradeOpen(false);
    setSelectedStudentForGrade(null);
    setNewGrade(5);
    setNewGradeType('Домашняя работа');
  };

  const removeGrade = (studentId: number, gradeId: number) => {
    setStudents(students.map(student => {
      if (student.id === studentId) {
        const updatedGrades = student.grades.filter(g => g.id !== gradeId);
        const average = updatedGrades.length > 0 
          ? updatedGrades.reduce((sum, g) => sum + g.value, 0) / updatedGrades.length 
          : 0;
        return {
          ...student,
          grades: updatedGrades,
          average: Math.round(average * 10) / 10,
          isProblematic: average < 3 && average > 0
        };
      }
      return student;
    }));
  };

  const updateStudent = (updatedStudent: Student) => {
    setStudents(students.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    setEditingStudent(null);
  };

  const addAbsence = () => {
    if (selectedStudentForAbsence === null) return;

    setStudents(students.map(student => {
      if (student.id === selectedStudentForAbsence) {
        const updatedAbsences = student.absences.map(absence => 
          absence.type === newAbsenceType 
            ? { ...absence, count: absence.count + 1 }
            : absence
        );
        return { ...student, absences: updatedAbsences };
      }
      return student;
    }));

    setIsAddAbsenceOpen(false);
    setSelectedStudentForAbsence(null);
    setNewAbsenceType('Н');
    setNewAbsenceReason('');
  };

  const exportToPDF = (type: 'class' | 'individual', studentId?: number) => {
    let content = '';
    
    if (type === 'class') {
      const classStudents = students.filter(s => s.class === selectedClass);
      content = `Отчет по классу ${selectedClass}\n\n`;
      
      classStudents.forEach(student => {
        content += `${student.name}:\n`;
        content += `- Средний балл: ${student.average}\n`;
        content += `- Оценки: ${student.grades.map(g => g.value).join(', ')}\n`;
        content += `- Пропуски: ${student.absences.map(a => `${a.type}: ${a.count}`).join(', ')}\n\n`;
      });
    } else if (type === 'individual' && studentId) {
      const student = students.find(s => s.id === studentId);
      if (student) {
        content = `Отчет по ученику: ${student.name}\n\n`;
        content += `Класс: ${student.class}\n`;
        content += `Средний балл: ${student.average}\n\n`;
        content += `Оценки:\n`;
        student.grades.forEach(grade => {
          content += `- ${grade.value} (${grade.type}) - ${grade.date}\n`;
        });
        content += `\nПропуски:\n`;
        student.absences.forEach(absence => {
          if (absence.count > 0) {
            content += `- ${absence.type}: ${absence.count}\n`;
          }
        });
        if (student.notes) {
          content += `\nЗаметки: ${student.notes}\n`;
        }
      }
    }
    
    // Создаем блоб и скачиваем
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = type === 'class' ? `Отчет_${selectedClass}.txt` : `Отчет_${students.find(s => s.id === studentId)?.name}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateTest = () => {
    const subjects = {
      'Математика': {
        'Алгебра': [
          'Решите уравнение: 2x + 5 = 13',
          'Найдите корни уравнения: x² - 4x + 3 = 0',
          'Упростите выражение: (x + 2)(x - 3)'
        ],
        'Геометрия': [
          'Найдите площадь треугольника со сторонами 3, 4, 5',
          'Вычислите периметр прямоугольника 12x8 см',
          'Найдите угол в равностороннем треугольнике'
        ]
      },
      'Русский язык': {
        'Орфография': [
          'Вставьте пропущенные буквы: пр....красный',
          'Поставьте ударение в слове: звонит',
          'Определите часть речи: быстро'
        ],
        'Пунктуация': [
          'Расставьте знаки препинания в предложении',
          'Объясните постановку запятых',
          'Поставьте тире в предложении'
        ]
      }
    };

    if (selectedTopic && selectedTasks.length > 0) {
      let test = `КОНТРОЛЬНАЯ РАБОТА\n`;
      test += `Предмет: ${selectedSubject}\n`;
      test += `Тема: ${selectedTopic}\n\n`;
      
      selectedTasks.forEach((task, index) => {
        test += `${index + 1}. ${task}\n\n`;
      });
      
      setGeneratedTest(test);
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 5) return 'text-green-600 bg-green-100';
    if (grade >= 4) return 'text-blue-600 bg-blue-100';
    if (grade >= 3) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getAbsenceColor = (type: string) => {
    switch (type) {
      case 'Н': return 'bg-red-100 text-red-800';
      case 'УП': return 'bg-green-100 text-green-800';
      case 'Б': return 'bg-blue-100 text-blue-800';
      case 'С': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <Icon name="GraduationCap" size={32} className="text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Личный кабинет учителя
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Пароль</label>
              <Input
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="h-12"
              />
            </div>
            <Button 
              onClick={handleLogin}
              className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold"
            >
              Войти в систему
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredStudents = students.filter(student => student.class === selectedClass);
  const classStats = {
    totalStudents: filteredStudents.length,
    averageGrade: filteredStudents.length > 0 
      ? filteredStudents.reduce((sum, s) => sum + s.average, 0) / filteredStudents.length 
      : 0,
    problematicStudients: filteredStudents.filter(s => s.isProblematic).length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Icon name="GraduationCap" size={28} className="text-blue-500" />
              <h1 className="text-xl font-bold text-gray-900">Кабинет учителя</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Онлайн
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAuthenticated(false)}
              >
                <Icon name="LogOut" size={16} className="mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Icon name="Home" size={16} />
              <span>Главная</span>
            </TabsTrigger>
            <TabsTrigger value="classes" className="flex items-center space-x-2">
              <Icon name="Users" size={16} />
              <span>Классы</span>
            </TabsTrigger>
            <TabsTrigger value="journal" className="flex items-center space-x-2">
              <Icon name="BookOpen" size={16} />
              <span>Журнал</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <Icon name="FileText" size={16} />
              <span>Отчеты</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center space-x-2">
              <Icon name="Calendar" size={16} />
              <span>Календарь</span>
            </TabsTrigger>
            <TabsTrigger value="constructor" className="flex items-center space-x-2">
              <Icon name="Settings" size={16} />
              <span>Конструктор</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center space-x-2">
              <Icon name="TrendingUp" size={16} />
              <span>Статистика</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Icon name="Cog" size={16} />
              <span>Настройки</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Всего учеников</p>
                      <p className="text-3xl font-bold">{students.length}</p>
                    </div>
                    <Icon name="Users" size={32} className="text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Средний балл</p>
                      <p className="text-3xl font-bold">
                        {students.length > 0 
                          ? (students.reduce((sum, s) => sum + s.average, 0) / students.length).toFixed(1)
                          : '0.0'
                        }
                      </p>
                    </div>
                    <Icon name="TrendingUp" size={32} className="text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100">Проблемные</p>
                      <p className="text-3xl font-bold">
                        {students.filter(s => s.isProblematic).length}
                      </p>
                    </div>
                    <Icon name="AlertTriangle" size={32} className="text-yellow-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">Классов</p>
                      <p className="text-3xl font-bold">{classes.length}</p>
                    </div>
                    <Icon name="School" size={32} className="text-purple-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon name="AlertCircle" size={20} className="text-red-500" />
                    <span>Проблемные ученики</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {students.filter(s => s.isProblematic).map(student => (
                      <div key={student.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div>
                          <p className="font-medium text-red-900">{student.name}</p>
                          <p className="text-sm text-red-600">Класс {student.class} • Средний балл: {student.average}</p>
                        </div>
                        <Badge variant="destructive">Внимание</Badge>
                      </div>
                    ))}
                    {students.filter(s => s.isProblematic).length === 0 && (
                      <p className="text-center text-gray-500 py-4">Проблемных учеников нет</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon name="Calendar" size={20} className="text-blue-500" />
                    <span>Сегодняшние занятия</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium text-blue-900">Математика - 9А</p>
                        <p className="text-sm text-blue-600">10:00 - 10:45</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Сейчас</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Алгебра - 10Б</p>
                        <p className="text-sm text-gray-600">11:00 - 11:45</p>
                      </div>
                      <Badge variant="outline">Следующий</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Classes */}
          <TabsContent value="classes" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Управление классами</h2>
              <div className="flex items-center space-x-4">
                <select 
                  value={selectedClass} 
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {classes.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
                <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-green-500 hover:bg-green-600">
                      <Icon name="Plus" size={16} className="mr-2" />
                      Добавить ученика
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Добавить нового ученика</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Имя ученика</Label>
                        <Input
                          id="name"
                          value={newStudentName}
                          onChange={(e) => setNewStudentName(e.target.value)}
                          placeholder="Введите полное имя"
                        />
                      </div>
                      <div>
                        <Label htmlFor="class">Класс</Label>
                        <Select value={newStudentClass} onValueChange={setNewStudentClass}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {classes.map(cls => (
                              <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="notes">Заметки</Label>
                        <Textarea
                          id="notes"
                          value={newStudentNotes}
                          onChange={(e) => setNewStudentNotes(e.target.value)}
                          placeholder="Дополнительная информация об ученике"
                        />
                      </div>
                      <Button onClick={addStudent} className="w-full">
                        Добавить ученика
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Ученики класса {selectedClass}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredStudents.map(student => (
                      <div key={student.id} className={`p-4 rounded-lg border-2 ${student.isProblematic ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <h3 className="font-semibold text-lg">{student.name}</h3>
                              {student.isProblematic && (
                                <Badge variant="destructive" className="text-xs">
                                  <Icon name="AlertTriangle" size={12} className="mr-1" />
                                  Проблемный
                                </Badge>
                              )}
                            </div>
                            <div className="mt-2 flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">Средний балл:</span>
                                <Badge className={`${student.average >= 4 ? 'bg-green-100 text-green-800' : student.average >= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                  {student.average || '—'}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-1">
                                {student.absences.map((absence, idx) => (
                                  <Badge key={idx} variant="outline" className={`text-xs ${getAbsenceColor(absence.type)}`}>
                                    {absence.type}: {absence.count}
                                  </Badge>
                                ))}
                                <div className="flex space-x-1 ml-2">
                                  {['Н', 'УП', 'Б', 'С'].map(type => (
                                    <button
                                      key={type}
                                      onClick={() => {
                                        setStudents(students.map(s => {
                                          if (s.id === student.id) {
                                            const updatedAbsences = s.absences.map(absence => 
                                              absence.type === type 
                                                ? { ...absence, count: absence.count + 1 }
                                                : absence
                                            );
                                            return { ...s, absences: updatedAbsences };
                                          }
                                          return s;
                                        }));
                                      }}
                                      className={`w-6 h-6 rounded text-xs font-bold border hover:scale-110 transition-transform ${getAbsenceColor(type)} border-current`}
                                    >
                                      {type}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {student.grades.map((grade, idx) => (
                                <div key={idx} className="relative group">
                                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${getGradeColor(grade.value)} cursor-pointer`}>
                                    {grade.value}
                                  </span>
                                  <button
                                    onClick={() => removeGrade(student.id, grade.id)}
                                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                              <button
                                onClick={() => {setSelectedStudentForGrade(student.id); setIsAddGradeOpen(true);}}
                                className="inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-dashed border-gray-300 text-gray-500 hover:border-blue-500 hover:text-blue-500"
                              >
                                +
                              </button>
                            </div>
                            {student.notes && (
                              <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                {student.notes}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEditingStudent(student)}
                            >
                              <Icon name="Edit" size={16} />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700"
                              onClick={() => deleteStudent(student.id)}
                            >
                              <Icon name="Trash2" size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Статистика класса {selectedClass}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Всего учеников</span>
                      <span className="font-semibold">{classStats.totalStudents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Средний балл</span>
                      <span className="font-semibold">{classStats.averageGrade.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Проблемные</span>
                      <span className="font-semibold text-red-600">{classStats.problematicStudients}</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Успеваемость</h4>
                    <Progress value={classStats.totalStudents > 0 ? (classStats.averageGrade / 5) * 100 : 0} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Journal */}
          <TabsContent value="journal" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Электронный журнал</h2>
              <div className="flex items-center space-x-4">
                <select 
                  value={selectedClass} 
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {classes.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Журнал класса {selectedClass}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ученик</TableHead>
                      <TableHead>Средний балл</TableHead>
                      <TableHead>Последние оценки</TableHead>
                      <TableHead>Пропуски</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map(student => (
                      <TableRow key={student.id} className={student.isProblematic ? 'bg-red-50' : ''}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>
                          <Badge className={`${student.average >= 4 ? 'bg-green-100 text-green-800' : student.average >= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                            {student.average || '—'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            {student.grades.slice(-5).map((grade, idx) => (
                              <span key={idx} className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-semibold ${getGradeColor(grade.value)}`}>
                                {grade.value}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            {student.absences.map((absence, idx) => (
                              absence.count > 0 && (
                                <Badge key={idx} variant="outline" className={`text-xs ${getAbsenceColor(absence.type)}`}>
                                  {absence.type}: {absence.count}
                                </Badge>
                              )
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              onClick={() => {setSelectedStudentForGrade(student.id); setIsAddGradeOpen(true);}}
                            >
                              <Icon name="Plus" size={14} className="mr-1" />
                              Оценка
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {setSelectedStudentForAbsence(student.id); setIsAddAbsenceOpen(true);}}
                            >
                              <Icon name="Calendar" size={14} className="mr-1" />
                              Пропуск
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredStudents.length === 0 && (
                  <div className="text-center py-8">
                    <Icon name="BookOpen" size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">В этом классе пока нет учеников</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Icon name="FileText" size={20} />
                  <span>Отчеты и экспорт</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Отчет по классу</h3>
                    <p className="text-sm text-gray-600 mb-4">Экспорт успеваемости класса в PDF</p>
                    <Button 
                      className="w-full"
                      onClick={() => exportToPDF('class')}
                    >
                      <Icon name="Download" size={16} className="mr-2" />
                      Скачать отчет
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Индивидуальные отчеты</h3>
                    <p className="text-sm text-gray-600 mb-4">Отчеты по каждому ученику</p>
                    <div className="space-y-2">
                      {filteredStudents.map(student => (
                        <Button 
                          key={student.id}
                          className="w-full text-xs" 
                          variant="outline"
                          onClick={() => exportToPDF('individual', student.id)}
                        >
                          <Icon name="FileText" size={14} className="mr-1" />
                          {student.name}
                        </Button>
                      ))}
                      {filteredStudents.length === 0 && (
                        <p className="text-sm text-gray-500 text-center">Выберите класс с учениками</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calendar */}
          <TabsContent value="calendar" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Календарь занятий</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Расписание на сегодня</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Математика</p>
                          <p className="text-sm text-gray-600">9А класс</p>
                        </div>
                        <Badge>10:00-10:45</Badge>
                      </div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Алгебра</p>
                          <p className="text-sm text-gray-600">10Б класс</p>
                        </div>
                        <Badge>11:00-11:45</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Constructor */}
          <TabsContent value="constructor" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon name="Settings" size={20} />
                    <span>Конструктор контрольных работ</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Предмет</Label>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Математика">Математика</SelectItem>
                        <SelectItem value="Русский язык">Русский язык</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Тема</Label>
                    <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тему" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedSubject === 'Математика' && (
                          <>
                            <SelectItem value="Алгебра">Алгебра</SelectItem>
                            <SelectItem value="Геометрия">Геометрия</SelectItem>
                          </>
                        )}
                        {selectedSubject === 'Русский язык' && (
                          <>
                            <SelectItem value="Орфография">Орфография</SelectItem>
                            <SelectItem value="Пунктуация">Пунктуация</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedTopic && (
                    <div>
                      <Label>Доступные задания</Label>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {(() => {
                          const subjects = {
                            'Математика': {
                              'Алгебра': [
                                'Решите уравнение: 2x + 5 = 13',
                                'Найдите корни уравнения: x² - 4x + 3 = 0',
                                'Упростите выражение: (x + 2)(x - 3)'
                              ],
                              'Геометрия': [
                                'Найдите площадь треугольника со сторонами 3, 4, 5',
                                'Вычислите периметр прямоугольника 12x8 см',
                                'Найдите угол в равностороннем треугольнике'
                              ]
                            },
                            'Русский язык': {
                              'Орфография': [
                                'Вставьте пропущенные буквы: пр....красный',
                                'Поставьте ударение в слове: звонит',
                                'Определите часть речи: быстро'
                              ],
                              'Пунктуация': [
                                'Расставьте знаки препинания в предложении',
                                'Объясните постановку запятых',
                                'Поставьте тире в предложении'
                              ]
                            }
                          };
                          return subjects[selectedSubject as keyof typeof subjects]?.[selectedTopic as keyof typeof subjects[typeof selectedSubject]]?.map((task, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`task-${index}`}
                                checked={selectedTasks.includes(task)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedTasks([...selectedTasks, task]);
                                  } else {
                                    setSelectedTasks(selectedTasks.filter(t => t !== task));
                                  }
                                }}
                                className="w-4 h-4"
                              />
                              <label htmlFor={`task-${index}`} className="text-sm cursor-pointer">
                                {task}
                              </label>
                            </div>
                          )) || [];
                        })()}
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={generateTest} 
                    disabled={!selectedTopic || selectedTasks.length === 0}
                    className="w-full"
                  >
                    <Icon name="FileText" size={16} className="mr-2" />
                    Сформировать контрольную
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Предпросмотр контрольной</CardTitle>
                </CardHeader>
                <CardContent>
                  {generatedTest ? (
                    <div>
                      <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg text-sm border">
                        {generatedTest}
                      </pre>
                      <div className="mt-4 flex space-x-2">
                        <Button 
                          onClick={() => {
                            const blob = new Blob([generatedTest], { type: 'text/plain;charset=utf-8' });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = `Контрольная_${selectedSubject}_${selectedTopic}.txt`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            URL.revokeObjectURL(url);
                          }}
                          className="flex-1"
                        >
                          <Icon name="Download" size={16} className="mr-2" />
                          Скачать
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => {setGeneratedTest(''); setSelectedTasks([]);}}
                          className="flex-1"
                        >
                          <Icon name="RotateCcw" size={16} className="mr-2" />
                          Очистить
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Icon name="FileText" size={48} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500">Выберите тему и задания для создания контрольной</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Statistics */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Общая статистика</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {classes.map(cls => {
                    const classStudents = students.filter(s => s.class === cls);
                    const avgGrade = classStudents.length > 0 
                      ? classStudents.reduce((sum, s) => sum + s.average, 0) / classStudents.length 
                      : 0;
                    
                    return (
                      <div key={cls} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Класс {cls}</span>
                          <span className="text-sm text-gray-600">{avgGrade.toFixed(1)}</span>
                        </div>
                        <Progress value={(avgGrade / 5) * 100} className="h-2" />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Распределение оценок</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[5, 4, 3, 2].map(grade => {
                      const count = students.reduce((sum, student) => 
                        sum + student.grades.filter(g => g.value === grade).length, 0
                      );
                      const total = students.reduce((sum, student) => sum + student.grades.length, 0);
                      const percentage = total > 0 ? (count / total) * 100 : 0;
                      
                      return (
                        <div key={grade} className="flex items-center space-x-3">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${getGradeColor(grade)}`}>
                            {grade}
                          </span>
                          <div className="flex-1">
                            <Progress value={percentage} className="h-2" />
                          </div>
                          <span className="text-sm text-gray-600 w-12">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Icon name="Cog" size={20} />
                  <span>Настройки системы</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Icon name="Cog" size={64} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Настройки в разработке</h3>
                  <p className="text-gray-600">Здесь будут системные настройки</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Grade Dialog */}
      <Dialog open={isAddGradeOpen} onOpenChange={setIsAddGradeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить оценку</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="grade">Оценка</Label>
              <Select value={newGrade.toString()} onValueChange={(value) => setNewGrade(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 (Отлично)</SelectItem>
                  <SelectItem value="4">4 (Хорошо)</SelectItem>
                  <SelectItem value="3">3 (Удовлетворительно)</SelectItem>
                  <SelectItem value="2">2 (Неудовлетворительно)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="gradeType">Тип работы</Label>
              <Select value={newGradeType} onValueChange={setNewGradeType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Домашняя работа">Домашняя работа</SelectItem>
                  <SelectItem value="Контрольная работа">Контрольная работа</SelectItem>
                  <SelectItem value="Самостоятельная работа">Самостоятельная работа</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={addGrade} className="w-full">
              Добавить оценку
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Student Dialog */}
      {editingStudent && (
        <Dialog open={!!editingStudent} onOpenChange={() => setEditingStudent(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Редактировать ученика</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editName">Имя ученика</Label>
                <Input
                  id="editName"
                  value={editingStudent.name}
                  onChange={(e) => setEditingStudent({...editingStudent, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="editClass">Класс</Label>
                <Select 
                  value={editingStudent.class} 
                  onValueChange={(value) => setEditingStudent({...editingStudent, class: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map(cls => (
                      <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editNotes">Заметки</Label>
                <Textarea
                  id="editNotes"
                  value={editingStudent.notes}
                  onChange={(e) => setEditingStudent({...editingStudent, notes: e.target.value})}
                />
              </div>
              <Button onClick={() => updateStudent(editingStudent)} className="w-full">
                Сохранить изменения
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Absence Dialog */}
      <Dialog open={isAddAbsenceOpen} onOpenChange={setIsAddAbsenceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Отметить пропуск</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="absenceType">Тип пропуска</Label>
              <Select value={newAbsenceType} onValueChange={setNewAbsenceType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Н">Н - Неуважительный пропуск</SelectItem>
                  <SelectItem value="УП">УП - Уважительный пропуск</SelectItem>
                  <SelectItem value="Б">Б - Пропуск по болезни</SelectItem>
                  <SelectItem value="С">С - Пропуск из-за соревнований</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="absenceReason">Причина (опционально)</Label>
              <Textarea
                id="absenceReason"
                value={newAbsenceReason}
                onChange={(e) => setNewAbsenceReason(e.target.value)}
                placeholder="Опишите причину пропуска"
              />
            </div>
            <Button onClick={addAbsence} className="w-full">
              <Icon name="Calendar" size={16} className="mr-2" />
              Отметить пропуск
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;