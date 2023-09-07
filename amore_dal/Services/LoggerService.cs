public class LoggerService
{
    private static LoggerService _instance;
    private static readonly object _lock = new object();

    private LoggerService() { }

    public static LoggerService Instance
    {
        get
        {
            lock (_lock)
            {
                if (_instance == null)
                {
                    _instance = new LoggerService();
                }
                return _instance;
            }
        }
    }

    public void Log(string message)
    {
        string filePath = Path.Combine(Directory.GetCurrentDirectory(), "logfile.txt");

        using (StreamWriter streamWriter = new StreamWriter(filePath, true))
        {
            streamWriter.WriteLine($"{DateTime.Now}: {message}");
        }
    }
}
