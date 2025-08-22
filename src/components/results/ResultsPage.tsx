import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Refresh as RefreshIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { apiService } from '../../services/api';

interface ERPExtraction {
  id: number;
  session_id: number;
  as_지원?: string;
  요청기관?: string;
  작업국소?: string;
  요청일?: string;
  요청시간?: string;
  요청자?: string;
  지원인원수?: string;
  지원요원?: string;
  장비명?: string;
  기종명?: string;
  as_기간만료여부?: string;
  시스템명?: string;
  요청사항?: string;
  confidence_score?: number;
  created_at?: string;
}

interface RegisterLog {
  id: number;
  extraction_id: number;
  erp_id?: string;
  status: string;
  registered_at?: string;
}

interface SessionInfo {
  id: number;
  file_name: string;
}

const ResultsPage: React.FC = () => {
  const [extractions, setExtractions] = useState<ERPExtraction[]>([]);
  const [registerLogs, setRegisterLogs] = useState<RegisterLog[]>([]);
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [dailyFolders, setDailyFolders] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('전체');
  const [selectedDay, setSelectedDay] = useState<string>('전체');
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState<number | null>(null);
  const [selectedExtraction, setSelectedExtraction] = useState<ERPExtraction | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [extractionsData, registerLogsData, sessionsData, audioFilesData] = await Promise.all([
        apiService.getExtractions(200),
        apiService.getRegisterLogs(200),
        apiService.getSessions(200),
        apiService.getAudioFiles(),
      ]);
      
      setExtractions(extractionsData.extractions || []);
      setRegisterLogs(registerLogsData.register_logs || []);
      setSessions(sessionsData.sessions || []);
      
      // 일자별 폴더 목록 추출
      const folders = Object.keys(audioFilesData.daily_files || {}).sort().reverse();
      setDailyFolders(folders);
      
    } catch (error) {
      console.error('데이터 로드 실패:', error);
      showSnackbar('데이터 로드에 실패했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const getRegistrationStatus = (extractionId: number) => {
    const log = registerLogs.find(log => log.extraction_id === extractionId && log.status === 'success');
    return log ? {
      registered: true,
      erp_id: log.erp_id || 'N/A',
      registered_at: log.registered_at || 'N/A'
    } : { registered: false };
  };

  const handleRegisterERP = async (extraction: ERPExtraction) => {
    if (!extraction.id) return;

    try {
      setRegistering(extraction.id);
      
      const erpData = {
        "AS 및 지원": extraction.as_지원 || '',
        "요청기관": extraction.요청기관 || '',
        "작업국소": extraction.작업국소 || '',
        "요청일": extraction.요청일 || '',
        "요청시간": extraction.요청시간 || '',
        "요청자": extraction.요청자 || '',
        "지원인원수": extraction.지원인원수 || '',
        "지원요원": extraction.지원요원 || '',
        "장비명": extraction.장비명 || '',
        "기종명": extraction.기종명 || '',
        "A/S기간만료여부": extraction.as_기간만료여부 || '',
        "시스템명(고객사명)": extraction.시스템명 || '',
        "요청 사항": extraction.요청사항 || ''
      };

      const response = await apiService.registerERP(erpData, extraction.id);
      
      if (response.status === 'success') {
        showSnackbar(`ERP 등록 성공! ID: ${response.erp_id}`, 'success');
        await loadData(); // 데이터 새로고침
      } else {
        throw new Error(response.message || 'ERP 등록 실패');
      }
    } catch (error: any) {
      console.error('ERP 등록 실패:', error);
      showSnackbar(`ERP 등록 실패: ${error.message}`, 'error');
    } finally {
      setRegistering(null);
    }
  };

  const handleCloseDetails = () => {
    setSelectedExtraction(null);
  };

  // 월별 목록 생성
  const getAvailableMonths = () => {
    const months = new Set<string>();
    dailyFolders.forEach(folder => {
      // YYYY-MM-DD에서 YYYY-MM 추출
      const monthPart = folder.substring(0, 7); // "YYYY-MM"
      months.add(monthPart);
    });
    return Array.from(months).sort().reverse();
  };

  // 선택된 월의 일자 목록 생성
  const getAvailableDays = () => {
    if (selectedMonth === '전체') return [];
    
    const days = dailyFolders
      .filter(folder => folder.startsWith(selectedMonth))
      .map(folder => folder.substring(8)) // "DD" 부분만 추출
      .sort()
      .reverse();
    
    return days;
  };

  // 현재 선택된 날짜 문자열 생성
  const getCurrentSelectedDate = () => {
    if (selectedMonth === '전체') return '전체';
    if (selectedDay === '전체') return selectedMonth; // 월만 선택
    return `${selectedMonth}-${selectedDay}`; // 완전한 날짜
  };

  const getFilteredExtractions = () => {
    const currentDate = getCurrentSelectedDate();
    
    if (currentDate === '전체') {
      return extractions;
    }

    // 필터링할 날짜 패턴 생성
    let datePattern: string;
    if (selectedDay === '전체') {
      // 월 단위 필터링
      datePattern = selectedMonth;
    } else {
      // 특정 일자 필터링
      datePattern = `${selectedMonth}-${selectedDay}`;
    }

    // 선택된 날짜/월의 파일 경로들 찾기
    const filteredSessionIds = sessions
      .filter(session => {
        if (session.file_name.includes('/')) {
          const [folderName] = session.file_name.split('/');
          return folderName.startsWith(datePattern);
        }
        return false;
      })
      .map(session => session.id);
    
    // 해당 세션들과 연관된 ERP 추출 결과만 필터링
    return extractions.filter(extraction => 
      filteredSessionIds.includes(extraction.session_id)
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const filteredExtractions = getFilteredExtractions();

  // 타이틀 텍스트 생성
  const getTitleText = () => {
    const currentDate = getCurrentSelectedDate();
    if (currentDate === '전체') {
      return '🔍 결과 조회 (전체 기간)';
    } else if (selectedDay === '전체') {
      return `🔍 결과 조회 (${selectedMonth} 월별)`;
    } else {
      return `🔍 결과 조회 (${selectedMonth}-${selectedDay})`;
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4">
            {getTitleText()}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={loadData}
          disabled={loading}
        >
          새로고침
        </Button>
      </Box>

      {/* 월/일 필터 */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
          <CalendarIcon /> 월별/일별 조회
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>조회 월</InputLabel>
            <Select
              value={selectedMonth}
              label="조회 월"
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                setSelectedDay('전체'); // 월 변경시 일자 초기화
              }}
            >
              <MenuItem value="전체">전체</MenuItem>
              {getAvailableMonths().map(month => (
                <MenuItem key={month} value={month}>{month}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 120 }} disabled={selectedMonth === '전체'}>
            <InputLabel>조회 일</InputLabel>
            <Select
              value={selectedDay}
              label="조회 일"
              onChange={(e) => setSelectedDay(e.target.value)}
            >
              <MenuItem value="전체">전체</MenuItem>
              {getAvailableDays().map(day => (
                <MenuItem key={day} value={day}>{day}일</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* 통계 정보 */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Typography variant="h6" color="primary">전체 ERP 추출</Typography>
            <Typography variant="h4">{extractions.length}</Typography>
            <Typography variant="body2" color="text.secondary">
              모든 날짜 기준
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Typography variant="h6" color="secondary">
              {getCurrentSelectedDate() === '전체' ? '전체' : getCurrentSelectedDate()} 추출
            </Typography>
            <Typography variant="h4">{filteredExtractions.length}</Typography>
            <Typography variant="body2" color="text.secondary">
              {getCurrentSelectedDate() === '전체' ? '모든 결과' : '선택된 기간 결과'}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Typography variant="h6" color="success">등록 완료</Typography>
            <Typography variant="h4">
              {filteredExtractions.filter(ext => {
                const status = getRegistrationStatus(ext.id);
                return status.registered;
              }).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ERP 시스템 등록됨
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Typography variant="h6" color="warning">미등록</Typography>
            <Typography variant="h4">
              {filteredExtractions.filter(ext => {
                const status = getRegistrationStatus(ext.id);
                return !status.registered;
              }).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              등록 대기 중
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {filteredExtractions.length === 0 ? (
        <Alert severity="info">
          {getCurrentSelectedDate() === '전체' 
            ? '아직 추출된 ERP 데이터가 없습니다.' 
            : `${getCurrentSelectedDate()}에 해당하는 ERP 추출 결과가 없습니다.`
          }
        </Alert>
      ) : (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            📋 {getCurrentSelectedDate() === '전체' ? '전체' : getCurrentSelectedDate()} ERP 추출 결과 ({filteredExtractions.length}개)
          </Typography>
        </Paper>
      )}

      {filteredExtractions.map((extraction) => {
        const status = getRegistrationStatus(extraction.id);
        const isRegistering = registering === extraction.id;

        // 해당 추출과 연관된 세션 찾기
        const relatedSession = sessions.find(session => session.id === extraction.session_id);
        const fileName = relatedSession?.file_name || 'N/A';
        const [dateFolder, actualFileName] = fileName.includes('/') ? fileName.split('/') : ['root', fileName];

        return (
          <Accordion key={extraction.id} sx={{ mb: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel-${extraction.id}-content`}
              id={`panel-${extraction.id}-header`}
            >
              <Box display="flex" alignItems="center" gap={2} width="100%">
                <Box>
                  <Typography variant="h6">
                    추출 ID: {extraction.id} - {extraction.장비명 || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    📁 {dateFolder} / 📄 {actualFileName}
                  </Typography>
                </Box>
                <Box flexGrow={1} />
                <Box display="flex" gap={1} alignItems="center">
                  {dateFolder !== 'root' && (
                    <Chip 
                      label={dateFolder} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                  )}
                  {status.registered ? (
                    <Chip
                      icon={<CheckCircleIcon />}
                      label="등록 완료"
                      color="success"
                      variant="outlined"
                    />
                  ) : (
                    <Chip
                      icon={<PendingIcon />}
                      label="미등록"
                      color="warning"
                      variant="outlined"
                    />
                  )}
                </Box>
              </Box>
            </AccordionSummary>
            
            <AccordionDetails>
              <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
                <Box flex={1} sx={{ '& > div': { mb: 1 } }}>
                  <Typography><strong>세션 ID:</strong> {extraction.session_id || 'N/A'}</Typography>
                  <Typography><strong>처리 파일:</strong> {fileName}</Typography>
                  <Typography><strong>일자 폴더:</strong> {dateFolder}</Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography><strong>AS 및 지원:</strong> {extraction.as_지원 || 'N/A'}</Typography>
                  <Typography><strong>요청기관:</strong> {extraction.요청기관 || 'N/A'}</Typography>
                  <Typography><strong>작업국소:</strong> {extraction.작업국소 || 'N/A'}</Typography>
                  <Typography><strong>요청일:</strong> {extraction.요청일 || 'N/A'}</Typography>
                  <Typography><strong>요청시간:</strong> {extraction.요청시간 || 'N/A'}</Typography>
                  <Typography><strong>요청자:</strong> {extraction.요청자 || 'N/A'}</Typography>
                  <Typography><strong>지원인원수:</strong> {extraction.지원인원수 || 'N/A'}</Typography>
                </Box>
                
                <Box flex={1}>
                  <Box sx={{ '& > div': { mb: 1 } }}>
                    <Typography><strong>지원요원:</strong> {extraction.지원요원 || 'N/A'}</Typography>
                    <Typography><strong>장비명:</strong> {extraction.장비명 || 'N/A'}</Typography>
                    <Typography><strong>기종명:</strong> {extraction.기종명 || 'N/A'}</Typography>
                    <Typography><strong>A/S기간만료여부:</strong> {extraction.as_기간만료여부 || 'N/A'}</Typography>
                    <Typography><strong>시스템명(고객사명):</strong> {extraction.시스템명 || 'N/A'}</Typography>
                    <Typography><strong>요청 사항:</strong> {extraction.요청사항 || 'N/A'}</Typography>
                    <Typography><strong>신뢰도:</strong> {extraction.confidence_score || 'N/A'}</Typography>
                    <Typography><strong>생성일:</strong> {extraction.created_at ? new Date(extraction.created_at).toLocaleString() : 'N/A'}</Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  {status.registered ? (
                    <Box>
                      <Alert severity="success" sx={{ mb: 2 }}>
                        ✅ ERP 등록 완료
                      </Alert>
                      <Typography><strong>ERP ID:</strong> {status.erp_id}</Typography>
                      <Typography><strong>등록일:</strong> {status.registered_at ? new Date(status.registered_at).toLocaleString() : 'N/A'}</Typography>
                      <Button
                        variant="outlined"
                        disabled
                        sx={{ mt: 1 }}
                      >
                        이미 등록됨
                      </Button>
                    </Box>
                  ) : (
                    <Box>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleRegisterERP(extraction)}
                        disabled={isRegistering}
                        startIcon={isRegistering ? <CircularProgress size={20} /> : null}
                        sx={{ mt: 1 }}
                      >
                        {isRegistering ? '등록 중...' : 'ERP 등록'}
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      })}

      {/* 상세 정보 다이얼로그 */}
      <Dialog
        open={!!selectedExtraction}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          추출 결과 상세 정보 (ID: {selectedExtraction?.id})
        </DialogTitle>
        <DialogContent>
          {selectedExtraction && (
            <Box display="flex" flexWrap="wrap" gap={2}>
              {Object.entries(selectedExtraction).map(([key, value]) => (
                <Box key={key} minWidth="300px" flex="1 1 45%">
                  <Typography>
                    <strong>{key}:</strong> {value || 'N/A'}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>닫기</Button>
        </DialogActions>
      </Dialog>

      {/* 스낵바 알림 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ResultsPage; 